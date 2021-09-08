import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiService } from 'src/app/services/api/api.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { LoadingController } from '@ionic/angular';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ToastController, ActionSheetController } from '@ionic/angular';
import { Clipboard } from '@ionic-native/clipboard/ngx';

@Component({
  selector: 'app-refer',
  templateUrl: './refer.page.html',
  styleUrls: ['./refer.page.scss'],
})
export class ReferPage implements OnInit {

  constructor(
    protected alertService: AlertService,
    protected api: ApiService,
    public localStorage: LocalStorage,
    private loadingController: LoadingController,
    private socialSharing: SocialSharing,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private clipboard: Clipboard
  ) { }
  result: Observable<any>;
  code: any = {};

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Loading data...',
    });
    await loading.present();
    this.api.setReferral();
    this.localStorage.getItem('user').subscribe((data: any) => {
      this.result = this.api.getMyCode(data.id);
      this.result.subscribe(data => {
        this.code = data;
        loading.dismiss();
      });
    });
    loading.dismiss();
  }

  async share() {
    let message = "Hi,I'm using Venice App. Download this app from http://example.com . Use my code "+this.code.code+" to get 5% discount on Medicine";
    const actionSheet = await this.actionSheetController.create({
      header: "Invite a Friend",
        buttons: [
          {
            text: "Share via Email",
            handler: () => {
              this.emailShare(message)
            }
          },
          {
            text: "Share via WhatsApp",
            handler: () => {
              this.whatsAppShare(message)
            }
          },
          {
            text: "Share via SMS",
            handler: () => {
              this.smsShare(message)
            }
          },

          {
            text: "Copy to Clipboard",
            handler: () => {
              this.copyToClipboard(message)
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

  copyToClipboard(message){

    this.clipboard.copy(message);
    this.alertService.presentToast('Text Coppied to Clipboard','success');
  }

  emailShare(message){

    this.socialSharing.shareViaEmail(message, 'Download Venice App', ['']).then(() => {
    }).catch(() => {
      // Error!
    });
  }

  smsShare(message){

    this.socialSharing.shareViaSMS(message,'').then(() => {
    }).catch(() => {
      // Error!
    });
  }

  whatsAppShare(message){

    this.socialSharing.shareViaWhatsAppToReceiver('',message).then(() => {
    }).catch(() => {
      // Error!
    });
  }

  submitCode(formData: NgForm) {
    this.api.submitPromo(formData.value.code);
  }

  async actionSheet(value) {
    this.alertService.tabAction(value);
  }

}
