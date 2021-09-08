import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { ApiService } from 'src/app/services/api/api.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-add-patient',
  templateUrl: './add-patient.page.html',
  styleUrls: ['./add-patient.page.scss'],
})
export class AddPatientPage implements OnInit {

  public base64Image: string;
  image:any;
  id = sessionStorage['pharmacy_id'];
  logo = sessionStorage.getItem('logo');
  pharmacy_name = sessionStorage.getItem('pharmacy_name');
  constructor(
    private router: Router,private alertService:AlertService,
    private camera: Camera,private api:ApiService,
    ) { }

  async submitForm(formData: NgForm){
    this.api.adPatient(formData,this.image,this.id);
  }

  ngOnInit() {
  }

  backClick(){
    this.router.navigate(['/home']);
  }
  regloginClick(){
    this.router.navigate(['/login']);
  }

 selectImage(){
   this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
 }

 takePicture(sourceType: PictureSourceType) {
   const options: CameraOptions = {
     quality: 70,
     allowEdit: true,
     sourceType: sourceType,
     destinationType: this.camera.DestinationType.DATA_URL,
     correctOrientation: true,
     encodingType: this.camera.EncodingType.JPEG,
     mediaType: this.camera.MediaType.PICTURE
   }
   this.camera.getPicture(options).then((imageData) => {
     this.base64Image = "data:image/jpeg;base64," + imageData;
     this.image = this.base64Image;
     var stringLength = this.image.length - 'data:image/jpeg;base64,'.length;

      var sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
      var sizeInKb=sizeInBytes/1000;

      if(sizeInKb>1024){
        this.image = undefined;
        this.alertService.presentToast('Maximum image size is 1 MB','danger');
      }

   }, (err) => {
     console.log(err);
   });

 }

 dismiss(){
   this.alertService.dismiss();
 }

 async actionSheet(value){
   this.alertService.tabAction(value);
 }

}
