import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ConfigService } from 'src/app/services/config/config.service';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddPatientPage } from '../add-patient/add-patient.page';
import {LoadingController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.page.html',
  styleUrls: ['./patients.page.scss'],
})
export class PatientsPage implements OnInit {
  public headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
  constructor(public authService: AuthenticationService,private api:ApiService,private alertController:AlertController,
  private config: ConfigService,private router: Router,public localStorage:LocalStorage,
  public modalController: ModalController,private loadingController: LoadingController,private alertService:AlertService,) {
  }

  result: Observable<any>;
  patients: any = [];
  baseUrl = this.config.baseUrl;
  logo = sessionStorage.getItem('logo');
  pharmacy_name = sessionStorage.getItem('pharmacy_name');
  async ngOnInit() {
    const loading = await this.loadingController.create({
      message: 'Loading data...',
    });
    await loading.present();

    this.localStorage.getItem('user').subscribe((data: any) => {
      this.result = this.api.getAllPatients(data.id);
      this.result.subscribe(data => {
        this.patients = data;
      });
    });
    loading.dismiss();
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: AddPatientPage
    });
    await modal.present();
    this.loadAgain();
  }


  doRefresh(event) {
    setTimeout(() => {
      this.loadAgain();
      event.target.complete();
    }, 2000);
  }

  loadAgain(){
    this.localStorage.getItem('user').subscribe((data: any) => {
      this.result = this.api.getAllPatients(data.id);
      this.result.subscribe(data => {
        this.patients = data;
      });
    });
  }

  deletePatient(id){
    this.api.deletePatient(id);
    this.loadAgain();
  }

  deleteConfirmation(id){
    this.alert('Warning','Are you sure you want to delete the patient ?',id)
  }

  async alert(header, message,id) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: [
        {
          text: 'Yes',
          role: 'yes',
          handler: () => {
            this.deletePatient(id);
          }
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    await alert.present();
  }

  detailsPatient(id){
    this.router.navigate(['/patient-details/'+id+'']);
  }

  async actionSheet(value){
    this.alertService.tabAction(value);
  }

}
