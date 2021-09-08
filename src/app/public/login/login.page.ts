import { Component, OnInit } from '@angular/core';
import { ModalController} from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { Router} from '@angular/router';
import { AlertController} from '@ionic/angular';
import { ConfigService } from 'src/app/services/config/config.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(
    private modalController: ModalController,
    public authService: AuthenticationService,
    private alertService: AlertService,private config:ConfigService,
    private router: Router,public alertController: AlertController,
  ) { }
  remember:boolean;
  public headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
  ngOnInit() {
  }

  dismissLogin() {
    this.modalController.dismiss();
  }

  async login(formData: NgForm) {
    let validate = this.validate(formData);
    if(validate == true){
      // if(this.remember == true){
      //   sessionStorage.setItem('remember','yes');
      // }
      // else{
      //   sessionStorage.setItem('remember','no');
      // }
      this.authService.login(formData,this.remember);
    }
  }

  click(){
    this.router.navigate(['/home']);
  }

  regOnClick(){
    this.router.navigate(['/register']);
  }

  forgotPassword(){
    let Link=this.config.baseUrl+'password/reset';
    window.open(Link, "_system");
  }



  validate(formData: NgForm) {
    if (formData.value.email == '') {
      this.alertService.presentToast('Please Enter Email Address','danger');
      return false;
    }
    else if (formData.value.password == '') {
      this.alertService.presentToast('Please Enter Password','danger');
      return false;
    }

    else {
      return true;
    }
  }

}
