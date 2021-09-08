import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { LoadingController, ModalController } from '@ionic/angular';
import { EventService } from 'src/app/services/event.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ConfigService } from 'src/app/services/config/config.service';
@Component({
  selector: 'app-locations',
  templateUrl: './locations.page.html',
  styleUrls: ['./locations.page.scss'],
})
export class LocationsPage implements OnInit {
  public headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
  constructor(private router: Router, private api: ApiService, private alertService: AlertService,private config : ConfigService,
    private loadingController: LoadingController,private event: EventService,public modalController: ModalController,
    protected localStorage: LocalStorage) {
  }
  result: Observable<any>;
  pharmacy: any = [];
  protected identity = "home";
  public counter = 0;
  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Please Wait...',
    });
    await loading.present();
    this.result = this.api.getAllPharmacy();
    this.result.subscribe(data => {
      this.pharmacy = data;
      loading.dismiss();
    });
  }


  // backClick() {
  //   if (Component === "home") {
  //     this.platform.backButton.subscribe(() => {
  //       if (this.counter == 0) {
  //         this.counter++;
  //         this.alertService.presentToast('Back again to exit');
  //         setTimeout(() => { this.counter = 0 }, 3000)
  //       } else {
  //         navigator['locations'].exitApp();
  //       }
  //     });
  //   }
  // }

  exitEvent(){
    this.event.exitEvent();
  }

  cardClick(id, name, logo) {
    sessionStorage.setItem('pharmacy_id', id);
    sessionStorage.setItem('pharmacy_name', name);
    sessionStorage.setItem('logo', logo);
    this.router.navigate(['/home']);
  }

  async actionSheet(value) {
    this.alertService.tabAction(value);
  }
}
