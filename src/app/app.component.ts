import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Router } from '@angular/router';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { ConfigService } from 'src/app/services/config/config.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/locations',
      icon: 'home'
    },
    {
      title: 'Dashboard',
      url: '/home',
      icon: 'menu'
    },
    {
      title: 'Refer Friends',
      url: '/refer',
      icon: 'share'
    },
    {
      title: 'Settings',
      url: 'settings',
      icon: 'settings'
    },
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    public authService: AuthenticationService,
    private screenOrientation: ScreenOrientation,
    protected localStorage: LocalStorage,
    protected config: ConfigService,
    protected alertService: AlertService,
    public user: UserService
  ) {
      this.initializeApp();
    }

    async initializeApp(){
      this.platform.ready().then(() => {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
        this.statusBar.styleLightContent();
        this.splashScreen.hide();
        this.localStorage.getItem('user').subscribe((data: any) => {
          if(data){
            this.authService.authenticationState.next(true);
            this.router.navigate(['/locations']);
            //this.router.navigate(['/refer']);
          }
          else{
            //this.router.navigate(['/refer']);
            this.router.navigate(['/login']);
          }
        });
      });
    }

  logout() {
    this.authService.logout();
  }

  loginButtonClick() {
    this.router.navigate(['/login']);
  }
}
