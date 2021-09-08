import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ActionSheetController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { NgForm } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Camera } from '@ionic-native/Camera/ngx';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';
import { AddPatientPage } from '../add-patient/add-patient.page';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LocalStorage } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-fill-prescription',
  templateUrl: './fill-prescription.page.html',
  styleUrls: ['./fill-prescription.page.scss'],
})

export class FillPrescriptionPage implements OnInit {
  result: Observable<any>;
  patients: any = [];
  public base64Image: string;
  images: any = [];
  token: any = {};
  delivery: boolean;
  logo = sessionStorage.getItem('logo');
  pharmacy_name = sessionStorage.getItem('pharmacy_name');
  public headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
  constructor(private api: ApiService,
    private alertService: AlertService, public localStorage: LocalStorage,
    public modalController: ModalController,
    private camera: Camera, private dateTimeService: DatetimeService,
    private actionSheetController: ActionSheetController, public authService: AuthenticationService,
    public alertController: AlertController, ) { }

  ngOnInit() {
    this.localStorage.getItem('user').subscribe((data: any) => {
      this.result = this.api.getAllPatients(data.id);
      this.result.subscribe(data => {
        this.patients = data;
      });
    });
  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: "Select Image source",
      buttons: [{
        text: 'Load from Library',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Use Camera',
        handler: () => {
          this.takePicture(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }

  takePicture(sourceType) {
    let options = {
      quality: 50,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(imageData => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      this.images.push(this.base64Image);
    }, err => {
      console.log(err);
    });
  }

  deleteImage(imgEntry, index) {
    this.images.splice(index, 1);
  }

  async submitForm(formData: NgForm) {
    //document.getElementById('delivery').getAttribute('value');
    if (this.images.length > 0) {
      this.api.submitPrescription(formData, this.images, this.delivery);
    }
    else {
      this.alertService.presentToast('Please Select an image', 'danger');
    }

  }

  timeBtnClick(value) {
    let new_date = this.dateTimeService.getDateTime(value);
    var element = document.getElementById('pickup');
    element.setAttribute('value', new_date);
  }

  changeColor(id: string) {
    this.dateTimeService.changeColor(id);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddPatientPage
    });
    return await modal.present();
  }

  updateDelivery() {
    console.log('Cucumbers new state:' + this.delivery);
  }


  async actionSheet(value) {
    this.alertService.tabAction(value);
  }
}
