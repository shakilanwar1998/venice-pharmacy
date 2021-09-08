import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ConfigService } from 'src/app/services/config/config.service';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Events} from '@ionic/angular';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  authenticationState = new BehaviorSubject(false);
  public headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
  constructor(
    private http: HttpClient, private loadingController: LoadingController,
    protected localStorage: LocalStorage, private alertService: AlertService,public user:UserService,
    private router: Router, private config: ConfigService,private events:Events
  ) {
    // this.plt.ready().then(()=>{
    //   this.checkToken();
    // });
  }

  async logout() {
    const loading = await this.loadingController.create({
      message: 'Logging out...',
    });
    await loading.present();
        this.localStorage.clear().subscribe(() => {
          sessionStorage.clear();
          this.events.publish('user:loggedOut');
          this.router.navigate(['login']);
        }, () => {
          loading.dismiss();
        });
    loading.dismiss();
  }

  async login(formData: NgForm,remember) {
    let data = formData.value;
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.http.post(this.config.yourSiteUrl + "login", data, this.headers)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        if (res['access_token']) {
          this.user.setUser(res['access_token'],remember);
          this.authenticationState.next(true);
          this.router.navigate(['locations']);
        }
        else {
          this.alertService.alert("Failed", "Incorrect Email or Password", "login");
        }
      });
  }

  async register(formData) {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    let data = formData.value;

    this.http.post(this.config.yourSiteUrl + "register", data, this.headers)
      .pipe(
        finalize(() => {
          loading.dismiss();
        })
      )
      .subscribe(res => {
        this.router.navigate(['login']);
      });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }
  // checkToken(){
  //   this.storage.ready().then(() => {
  //     this.storage.get(TOKEN_KEY).then(token => {
  //       this.http.get(this.config.yourSiteUrl + "getuser?token=" + token + "", this.headers)
  //         .subscribe(res => {
  //           if (res['code'] == 404) {
  //             console.log(res['code']);
  //             sessionStorage.setItem('temp','invalid');
  //           }
  //           else {
  //             sessionStorage.setItem('temp','valid');
  //           }
  //         });
  //     });
  //   });
  //   var validation = sessionStorage.getItem('temp');
  //   if (validation == 'valid') {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }
}
