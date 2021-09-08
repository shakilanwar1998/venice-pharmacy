import { Injectable } from '@angular/core';
import { Camera, CameraOptions, PictureSourceType } from '@ionic-native/Camera/ngx';
import { AlertService } from 'src/app/services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(
      private camera: Camera,
      private alertService:AlertService
  ) { }
  public base64Image: string;

  takePicture(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 100,
      allowEdit: true,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.DATA_URL,
      correctOrientation: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      this.base64Image = "data:image/jpeg;base64," + imageData;
      var stringLength = this.base64Image.length - 'data:image/jpeg;base64,'.length;
       var sizeInBytes = 4 * Math.ceil((stringLength / 3))*0.5624896334383812;
       var sizeInKb=sizeInBytes/1000;

       if(sizeInKb>1024){
         this.alertService.presentToast('Maximum image size is 1 MB','danger');
         return this.base64Image;
       }
       else{
         return undefined;
       }

    }, (err) => {
      console.log(err);
    });

  }
}
