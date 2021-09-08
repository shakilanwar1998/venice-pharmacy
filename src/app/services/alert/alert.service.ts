import { Injectable } from '@angular/core';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor(private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private alertController:AlertController,private modalController:ModalController,
    private router:Router
  ) { }


  async presentToast(text,color) {
    const toast = await this.toastController.create({
      message: text,
      position: 'top',
      duration: 3000,
      color:color
    });
    toast.present();
  }

  tabAction(value){
    if(value=='call'){
      this.call();
    }
    if(value=='email'){
      this.email();
    }
    if(value=='link'){
      this.link();
    }
    if(value=='info'){
      this.router.navigate(['/about']);
    }
    if(value=='home'){
      this.router.navigate(['/locations']);
    }
  }

  async alert(header, message, route) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            this.router.navigate([route]);
          }
        }
      ]
    });
    await alert.present();
  }

  async alertNoRoute(header, message) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
          handler: () => {
            this.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }

  dismiss() {
   this.modalController.dismiss({
     'dismissed': true
   });
 }

  async call() {
    const actionSheet = await this.actionSheetController.create({
      header: "Choose a Number",
        buttons: [{
          text: sessionStorage.getItem('pharmacy_phone'),
          handler: () => {
            let Link="tel:"+sessionStorage.getItem('pharmacy_phone')+"";
            window.open(Link, "_system");
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

async email(){
    const actionSheet = await this.actionSheetController.create({
      header: "Choose an Email",
      buttons: [{
        text: sessionStorage.getItem('pharmacy_email'),
        handler: () => {
          let Link="mailto:"+sessionStorage.getItem('pharmacy_email')+"";
          window.open(Link, "_system");
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

  async link(){
      const actionSheet = await this.actionSheetController.create({
        header: "Browse our website",
        buttons: [{
          text: sessionStorage.getItem('pharmacy_website'),
          handler: () => {
            let Link="http://"+sessionStorage.getItem('pharmacy_website')+"";
            window.open(Link, "_system");
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
}
