import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private router: Router,
  private alertController:AlertController) { }

  exitEvent(){
    this.alert('Warning','Are you sure you want to Exit ?')
  }

  async alert(header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            navigator['app'].exitApp();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }
}
