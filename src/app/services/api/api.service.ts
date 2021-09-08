import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/services/config/config.service';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { AlertService } from 'src/app/services/alert/alert.service';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, private config: ConfigService,
    private alertService: AlertService, private loadingController: LoadingController, public user: UserService,
    public authService: AuthenticationService, private localStorage: LocalStorage, private transfer: FileTransfer) {
    this.getUser();
  }

  public user_id: any = {};

  async getUser() {
    this.localStorage.getItem('user').subscribe((data: any) => {
      this.user_id = data.id;
    });
  }


  public headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };

  async adPatient(formData: NgForm, image, id) {
    let validate = this.patientValidate(formData);
    if (validate == true) {
      const loading = await this.loadingController.create({
        message: 'Submitting Details...',
      });
      await loading.present();

      this.localStorage.getItem('user').subscribe((value: any) => {
        let data = {
          'fname': formData.value.fname,
          'lname': formData.value.lname,
          'mobile': formData.value.mobile,
          'dob': formData.value.dob,
          'app_user_id': value.id,
          'pharmacy_id': id,
          'postal': formData.value.postal,
          'country': formData.value.country,
          'province': formData.value.province,
          'city': formData.value.city,
          'street': formData.value.street,
          'health_card': formData.value.health_card,
        };

        this.http.post(this.config.yourSiteUrl + "addpatient", data, this.headers)
          .pipe(
            finalize(() => {
              loading.dismiss();
            })
          )
          .subscribe(res => {
            if (res['success']) {
              if (image) {
                this.uploadProfilePic(res['data'], image);
              }
              else {
                this.alertService.alert("Success", "Patient Added successfully","patients");
                this.alertService.dismiss();
              }
            } else {
              this.alertService.presentToast('failed','danger');
            }
          });
      });
    }
  }



  async uploadProfilePic(res, image) {
    const loading = await this.loadingController.create({
      message: 'Uploading Photo...',
    });
    await loading.present();

    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: "photo",
      fileName: res,
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }

    fileTransfer.upload(image, this.config.yourSiteUrl + "addpatient/image", options).then(data => {
    }, error => {
      loading.dismiss();
      this.alertService.alert("Failed", "Submission failed", "add-patient");
    });

    loading.dismiss();
    this.alertService.alert("Success", "Patient added successfully", "patients");
  }


  async submitPrescription(formData, images, delivery) {
    let validate = this.prescriptionValidate(formData);

    if (validate == true) {
      const loading = await this.loadingController.create({
        message: 'Submitting Form...',
      });
      await loading.present();

      let patient = formData.value.patient;
      let patient_type = 1;

      if (delivery == true) {
        delivery = "Yes";
      }
      else if (delivery == false) {
        delivery = "No";
      }

      this.localStorage.getItem('user').subscribe((value: any) => {
        let data = {
          'patient_id': patient,
          'instructions': formData.value.instructions,
          'pickup_date': formData.value.pickup_time,
          'app_user_id': value.id,
          'patient_type': patient_type,
          'delivery': delivery,
          'pharmacy_id' : sessionStorage.getItem('pharmacy_id')
        };

        this.http.post(this.config.yourSiteUrl + "submit_prescription", data, this.headers)
          .pipe(
            finalize(() => {
              loading.dismiss();
            })
          )
          .subscribe(res => {
            if (res['success']) {
              this.uploadPrescriptionImage(res, images);
            } else {
              this.alertService.presentToast('failed','danger');
            }
          });
      });
    }
  }

  async uploadPrescriptionImage(res, images) {
    const loading = await this.loadingController.create({
      message: 'Uploading Photo...',
    });
    await loading.present();

    for (let i = 0; i < images.length; i++) {
      const fileTransfer: FileTransferObject = this.transfer.create();
      let options: FileUploadOptions = {
        fileKey: "photo",
        fileName: res['data'],
        chunkedMode: false,
        mimeType: "image/jpeg",
        headers: {}
      }

      fileTransfer.upload(images[i], this.config.yourSiteUrl + "submit_prescription/image", options).then(data => {
      }, error => {
        loading.dismiss();
      });
    }
    loading.dismiss();
    this.alertService.alert("Success", "Pescription submitted successfully. <br /> Your prescription ID is: " + res['prescription_id'] + ". " + "You must present your original prescription to pick up your medication", "home");
  }


  async refillPrescription(formData) {
    const loading = await this.loadingController.create({
      message: 'Submitting form...',
    });
    await loading.present();

    if (formData.delivery == true) {
      var delivery = "Yes";
    }
    else if (formData.delivery == false) {
      var delivery = "No";
    }

    this.localStorage.getItem('user').subscribe((value: any) => {
      var data = {
        'patient_id': formData.patient,
        'instructions': formData.instructions,
        'pickup_time': formData.pickup_time,
        'app_user_id': value.id,
        'delivery': delivery,
        'rx_id': formData.rx_id,
        'pharmacy_id' : sessionStorage.getItem('pharmacy_id')
      };
      this.http.post(this.config.yourSiteUrl + "refill_prescription", data, this.headers)
        .pipe(
          finalize(() => {
            loading.dismiss();
          })
        )
        .subscribe(res => {
          if (res['success']) {
            this.alertService.alert("Success", "Pescription submitted successfully. <br /> Your prescription ID is: " + res['prescription_id'] + ". " + "You must present your original prescription to pick up your medication", "home");
          }
        });
    });

  }

  async transferPrescription(formData, patient_id, delivery) {
    let date = new Date(formData.value.pickup_time);

    const loading = await this.loadingController.create({
      message: 'Submitting Details...',
    });
    await loading.present();

    let patient_type = 1;

    if (delivery == true) {
      delivery = "Yes";
    }
    else if (delivery == false) {
      delivery = "No";
    }

    this.localStorage.getItem('user').subscribe((value: any) => {
      let data = {
        'pharmacy_name': formData.value.pharmacy_name,
        'phone': formData.value.phone,
        'address': formData.value.address,
        'prescription_number': formData.value.prescription_number,
        'pickup_time': formData.value.pickup_time,
        'delivery': delivery,
        'instructions': formData.value.instructions,
        'patient_id': patient_id,
        'app_user_id': value.id,
        'patient_type': patient_type,
        'pharmacy_id' : sessionStorage.getItem('pharmacy_id')
      };

      this.http.post(this.config.yourSiteUrl + "transfer_prescription", data, this.headers)
        .pipe(
          finalize(() => {
            loading.dismiss();
          })
        )
        .subscribe(res => {
          if (res['success']) {
            this.alertService.alert("Success", "Your Transfer Request Submitted Successfully", "home");
          }
        });
    });
  }

  async submitConsultation(formData: NgForm) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.localStorage.getItem('user').subscribe((value: any) => {

      if (formData.value.other != '') {
        var subject = formData.value.other;
      }
      else {
        var subject = formData.value.subject;
      }

      let preferred = '0';
      if(formData.value.preferred == true){
        preferred = '1';
      }
      let data = {
        'app_user_id': value.id,
        'subject': subject,
        'preferred' : preferred,
        'comment': formData.value.comment,
        'pharmacy_id' : sessionStorage.getItem('pharmacy_id')
      };

      this.http.post(this.config.yourSiteUrl + "submitconsultation", data, this.headers)
        .pipe(
          finalize(() => {
            loading.dismiss();
          })
        )
        .subscribe(res => {
          if (res['success']) {
            this.alertService.alert("Success", "Our pharmacy Team member will call you to confirm your appointment", "consultation");
          }
        });
    });
  }

  sendMessage(message) {
    this.localStorage.getItem('user').subscribe((value: any) => {
      var data = {
        'message': message,
        'user_id': value.id
      };
      this.http.post(this.config.yourSiteUrl + "sendmessage", data, this.headers)
        .pipe(finalize(() => { })).subscribe(() => { });
    });
  }

  async submitPromo(code) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.localStorage.getItem('user').subscribe((value: any) => {
      var data = {
        'code': code,
        'user_id': value.id
      };
      this.http.post(this.config.yourSiteUrl + "submitcode", data, this.headers)
        .pipe(
          finalize(() => {
            loading.dismiss();
          })
        )
        .subscribe(res => {
          if (res['info'] == 'ok') {
            this.alertService.alert("Success", "Congratulations ! Your Referral code applied successfully", "refer");
          }
          else if (res['info'] == 'duplicate') {
            this.alertService.alert("Alert", "You have already applied a referral code", "refer");
          }
          else if (res['info'] == 'self') {
            this.alertService.alert("Alert", "You can not use your own code", "refer");
          }
          else if (res['info'] == 'invalid') {
            this.alertService.alert("Alert", "Invalid Referral Code", "refer");
          }
        });
    });

  }

  setReferral() {
    this.localStorage.getItem('user').subscribe((value: any) => {
      let data = {
        'user_id': value.id
      };
      this.http.post(this.config.yourSiteUrl + "setreferral", data, this.headers)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe(res => {
          //
        });
    });
  }


  changePassword(formData){
    this.localStorage.getItem('user').subscribe((value: any) => {
      let data = {
        'user_id': value.id,
        'password': formData.value.password
      };
      this.http.post(this.config.yourSiteUrl + "changepassword", data, this.headers)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe(res => {
          //
        });
    });
  }

  updateProfile(formData){
    this.localStorage.getItem('user').subscribe((value: any) => {
      let data = {
        'user_id': value.id,
        'name': formData.update_name,
        'dob' : formData.update_dob,
      };
      this.http.post(this.config.yourSiteUrl + "updateprofile", data, this.headers)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe(res => {
          //
        });
    });
  }

  changeEmail(formData){
    this.localStorage.getItem('user').subscribe((value: any) => {
      let data = {
        'email': formData.value.update_email,
      };
      this.http.post(this.config.yourSiteUrl + "changeemail", data, this.headers)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe(res => {
          //
        });
    });
  }
  changeMobile(formData){
    this.localStorage.getItem('user').subscribe((value: any) => {
      let data = {
        'mobile': formData.value.update_mobile,
      };
      this.http.post(this.config.yourSiteUrl + "changemobile", data, this.headers)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe(res => {
          //
        });
    });
  }

  deletePatient(id){
    this.localStorage.getItem('user').subscribe((value: any) => {
      let data = {
        'id': id,
      };
      this.http.post(this.config.yourSiteUrl + "deletepatient", data, this.headers)
        .pipe(
          finalize(() => {
          })
        )
        .subscribe(res => {
          //
        });
    });
  }

  getUserDetails(id){
    return this.http.get(this.config.yourSiteUrl + "getuserdetails?user_id=" + id + "", this.headers);
  }

  getMyCode(id) {
    return this.http.get(this.config.yourSiteUrl + "getmycode?user_id=" + id + "", this.headers);
  }

  getAllPatients(id) {
    return this.http.get(this.config.yourSiteUrl + "getallpatients?user_id=" + id + "", this.headers);
  }

  getAllMessages(id) {
    return this.http.get(this.config.yourSiteUrl + "getmessages?user_id=" + id + "", this.headers);
  }

  getPharmacy(id) {
    return this.http.get(this.config.yourSiteUrl + "getpharmacy?id=" + id + "", this.headers)
  }
  getAllPharmacy() {
    return this.http.get(this.config.yourSiteUrl + "getallpharmacy", this.headers)
  }


  getPatient(id) {
    return this.http.get(this.config.yourSiteUrl + "getpatient?id=" + id + "", this.headers)
  }
  getPatientPrescriptions(id) {
    return this.http.get(this.config.yourSiteUrl + "getpatientprescriptions?id=" + id + "", this.headers)
  }
  getPrescriptionDetails(id) {
    return this.http.get(this.config.yourSiteUrl + "getprescriptiondetails?id=" + id + "", this.headers)
  }

  //Validate

  prescriptionValidate(formData) {
    if (formData.value.patient == '') {
      this.alertService.presentToast('Please select a patient','danger');
      return false;
    }
    else if (formData.value.pickup_date == '') {
      this.alertService.presentToast('Please select a pickup date','danger');
      return false;
    }
    else if (formData.value.pickup_date == '') {
      this.alertService.presentToast('Please select a pickup date','danger');
      return false;
    }
    else if (formData.value.instructions == '') {
      this.alertService.presentToast('Please write some instructions','danger');
      return false;
    }
    else {
      return true;
    }
  }

  patientValidate(formData: NgForm) {
    console.log(formData.value.fname);
    if (formData.value.fname == '') {
      this.alertService.presentToast('Please input first name','danger');
      console.log(formData.value.fname);
      return false;
    }
    else if (formData.value.lname == '') {
      this.alertService.presentToast('Please input last name','danger');
      return false;
    }
    else if (formData.value.mobile == '') {
      this.alertService.presentToast('Please Enter Phone Number','danger');
      return false;
    }
    else if (formData.value.dob == '') {
      this.alertService.presentToast('Please input date of birth','danger');
      return false;
    }
    else if (formData.value.address == '') {
      this.alertService.presentToast('Please Enter Address','danger');
      return false;
    }
    else {
      return true;
    }
  }

  loginValidate(formData: NgForm) {
    if (formData.value.email == '') {
      this.alertService.presentToast('Please Enter Email Address','danger');
      return false;
    }
    else if (formData.value.password == '') {
      this.alertService.presentToast('Please Enter Password','danger');
      return false;
    }

    else {
      return true;
    }
  }
}
