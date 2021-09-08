import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Observable } from 'rxjs/Observable';
import { LoadingController } from '@ionic/angular';
import { ConfigService } from 'src/app/services/config/config.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  profile:any = {
    showDetails : false,
    icon : "arrow-dropdown"
  };
  password:any = {
    showDetails : false,
    icon : "arrow-dropdown"
  };

  mobile:any = {
    showDetails : false,
    icon : "arrow-dropdown"
  };
  email:any = {
    showDetails : false,
    icon : "arrow-dropdown"
  };

  result: Observable<any>;
  userdata: any = [];
  prescriptions: any = [];
  baseUrl = this.config.baseUrl;

  update_name:any;
  update_email:any;
  update_mobile:any;
  update_dob:any;

  constructor(public navCtrl: NavController,private loadingController: LoadingController,
  private config: ConfigService,private api:ApiService,private localStorage: LocalStorage,
  private alertService: AlertService) {

  }

  toggleDetails(data) {
    if(data == 'profile'){
      if (this.profile.showDetails) {
          this.profile.showDetails = false;
          this.profile.icon = "arrow-dropdown";
      } else {
          this.profile.showDetails = true;
          this.profile.icon = "arrow-dropup";
      }
    }

    if(data == 'password'){
      if (this.password.showDetails) {
          this.password.showDetails = false;
          this.password.icon = "arrow-dropdown";
      } else {
          this.password.showDetails = true;
          this.password.icon = "arrow-dropup";
      }
    }

    if(data == 'mobile'){
      if (this.mobile.showDetails) {
          this.mobile.showDetails = false;
          this.mobile.icon = "arrow-dropdown";
      } else {
          this.mobile.showDetails = true;
          this.mobile.icon = "arrow-dropup";
      }
    }

    if(data == 'email'){
      if (this.email.showDetails) {
          this.email.showDetails = false;
          this.email.icon = "arrow-dropdown";
      } else {
          this.email.showDetails = true;
          this.email.icon = "arrow-dropup";
      }
    }

  }

  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Loading data...',
    });
    await loading.present();
    await this.loadProfile();
    loading.dismiss();
  }

  loadProfile(){
    this.localStorage.getItem('user').subscribe((value: any) => {
      this.result = this.api.getUserDetails(value.id);
      this.result.subscribe(data => {
        this.userdata = data;
        this.update_name = this.userdata.name;
        this.update_dob = this.userdata.dob;
        this.update_email = this.userdata.email;
        this.update_mobile = this.userdata.phone;
      });
    });
  }

  async changePassword(formData : NgForm){
    if(formData.value.password == formData.value.c_password){
      if(formData.value.password.length >=6){
        const loading = await this.loadingController.create({
          message: 'Please Wait...',
        });
        await loading.present();
        this.api.changePassword(formData);
        await this.loadProfile();
        loading.dismiss();
        this.alertService.presentToast('Password Changed','success');
        this.password.showDetails = false;
        this.password.icon = "arrow-dropdown";
      }
      else{
        this.alertService.presentToast('Password must be at least 6 characters','danger');
      }
    }
    else{
      this.alertService.presentToast('Password did not mathed','danger');
    }
  }

  async updateProfile(formData : NgForm){
    if(formData.value.update_name != null && formData.value.update_dob != null){
      const loading = await this.loadingController.create({
        message: 'Please Wait...',
      });
      await loading.present();
      this.api.updateProfile(formData.value);
      this.localStorage.setItem('user', this.userdata).subscribe(() => { }, () => { });
      await this.loadProfile();
      console.log(this.userdata);
      loading.dismiss();
      this.alertService.presentToast('Profile Updated','success');
      this.profile.showDetails = false;
      this.profile.icon = "arrow-dropdown";

    }
  }

  async changeEmail(formData : NgForm){
    if(formData.value.update_email !=null){
      const loading = await this.loadingController.create({
        message: 'Please Wait...',
      });
      await loading.present();
      this.api.changeEmail(formData);
      await this.loadProfile();
      loading.dismiss();
      this.alertService.presentToast('Email Changed','success');
      this.email.showDetails = false;
      this.email.icon = "arrow-dropdown";
    }
  }
  async changeMobile(formData : NgForm){
    if(formData.value.update_mobile !=null){
      const loading = await this.loadingController.create({
        message: 'Please Wait...',
      });
      await loading.present();
      this.api.changeMobile(formData);
      await this.loadProfile();
      loading.dismiss();
      this.alertService.presentToast('Mobile Number Changed','success');
      this.mobile.showDetails = false;
      this.mobile.icon = "arrow-dropdown";
    }

  }

  async actionSheet(value){
    this.alertService.tabAction(value);
  }
}
