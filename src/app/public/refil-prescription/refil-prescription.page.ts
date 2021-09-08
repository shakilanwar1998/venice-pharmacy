import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { LoadingController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { AddPatientPage } from '../add-patient/add-patient.page';
import { ModalController } from '@ionic/angular';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';
import { NgForm } from '@angular/forms';
@Component({
  selector: 'app-refil-prescription',
  templateUrl: './refil-prescription.page.html',
  styleUrls: ['./refil-prescription.page.scss'],
})
export class RefilPrescriptionPage implements OnInit {
  result: Observable<any>;
  patients: any = [];
  prescriptions : any = [];
  delivery: boolean;
  patient : any;
  logo = sessionStorage.getItem('logo');
  pharmacy_name = sessionStorage.getItem('pharmacy_name');
  public headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
  constructor(private router: Router,public localStorage:LocalStorage,public modalController: ModalController,
    private loadingController: LoadingController,private alertService:AlertService,private api:ApiService,
    private dateTimeService: DatetimeService) { }

  ngOnInit() {
    this.localStorage.getItem('user').subscribe((data: any) => {
      this.result = this.api.getAllPatients(data.id);
      this.result.subscribe(data => {
        this.patients = data;
      });
    });
  }

  async patientSelect(){
    const loading = await this.loadingController.create({
      message: 'Loading Previous RX...',
    });
    await loading.present();
    this.result = this.api.getPatientPrescriptions(this.patient);
    this.result.subscribe(data => {
      this.prescriptions = data;

      console.log(this.prescriptions);
      loading.dismiss();
    });

  }

  clickPrescription(id){
    this.router.navigate(['/refill-form/'+id+'']);
  }

  async actionSheet(value){
    this.alertService.tabAction(value);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: AddPatientPage
    });
    return await modal.present();
  }

  changeColor(id: string) {
    this.dateTimeService.changeColor(id);
  }

  timeBtnClick(value) {
    let new_date = this.dateTimeService.getDateTime(value);
    var element = document.getElementById('pickup');
    element.setAttribute('value', new_date);
  }

  updateDelivery() {
    console.log('Cucumbers new state:' + this.delivery);
  }

  async submitForm(formData: NgForm) {
    console.log(formData.value);
    this.api.refillPrescription(formData.value);
  }

}
