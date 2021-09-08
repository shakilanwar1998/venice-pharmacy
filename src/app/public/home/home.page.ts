import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { ApiService } from 'src/app/services/api/api.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { EventService } from 'src/app/services/event.service';
import { UserService } from 'src/app/services/user/user.service';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  id = sessionStorage['pharmacy_id'];
  result: Observable<any>;
  pharmacy: any = {};
  public headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
  constructor(private router: Router, private api: ApiService, private alertService: AlertService,
    private loadingController: LoadingController,public user: UserService,
    public authService: AuthenticationService,private config : ConfigService,
    private event: EventService
    ) {

  }

  async ngOnInit() {
    if (typeof sessionStorage.pharmacy_id == 'undefined') {
      this.router.navigate(['/locations']);
    }

    const loading = await this.loadingController.create({
      message: 'Loading data...',
    });
    await loading.present();

    this.result = this.api.getPharmacy(this.id);
    this.result.subscribe(data => {
      this.pharmacy = data;
      sessionStorage.setItem('pharmacy_email',this.pharmacy.email);
      sessionStorage.setItem('pharmacy_website',this.pharmacy.website);
      sessionStorage.setItem('pharmacy_phone',this.pharmacy.contact);
      loading.dismiss();
    });
    loading.dismiss();

  }

  async actionSheet(value) {
    this.alertService.tabAction(value);
  }


  menuClick(menu) {
    if (menu == 'fill') {
      this.router.navigate(['/fill-prescription']);
    }
    if (menu == 'refill') {
      this.router.navigate(['/refill-prescription']);
    }
    if (menu == 'map') {
      this.router.navigate(['/map']);
    }
    if (menu == 'transfer') {
      this.router.navigate(['/transfer-prescription']);
    }
    if (menu == 'call') {
      this.router.navigate(['/call-my-doctor']);
    }
    if (menu == 'deal') {
      this.router.navigate(['/deals']);
    }
    if (menu == 'patients') {
      this.router.navigate(['/patients']);
    }
    if (menu == 'consultation') {
      this.router.navigate(['/consultation']);
    }
    if (menu == 'chat') {
      this.router.navigate(['/chatting']);
    }
  }

  exitEvent(){
    this.event.exitEvent();
  }


}
