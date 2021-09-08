import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { LoadingController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiService } from 'src/app/services/api/api.service';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { AddPatientPage } from '../add-patient/add-patient.page';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-transfer-prescription',
  templateUrl: './transfer-prescription.page.html',
  styleUrls: ['./transfer-prescription.page.scss'],
})
export class TransferPrescriptionPage implements OnInit {

  constructor(
    private alertService: AlertService, private loadingController: LoadingController,
    public authService: AuthenticationService, private api: ApiService,
    private dateTimeService: DatetimeService,public localStorage: LocalStorage,
    public modalController: ModalController,

  ) { }
  result: Observable<any>;
  delivery: boolean;
  patients: any = [];
  pharmacy: any = {};
  patient_id: any;
  id = sessionStorage['pharmacy_id'];
  logo = sessionStorage.getItem('logo');
  pharmacy_name = sessionStorage.getItem('pharmacy_name');
  ngOnInit() {
    this.localStorage.getItem('user').subscribe((data: any) => {
      this.result = this.api.getAllPatients(data.id);
      this.result.subscribe(data => {
        this.patients = data;
      });
    });
  }

  async actionSheet(value) {
    this.alertService.tabAction(value);
  }


  async loadOption() {
    const loading = await this.loadingController.create({
      message: 'Please wait...',
    });
    await loading.present();

    this.result = this.api.getPharmacy(this.id);
    this.result.subscribe(data => {
      this.pharmacy = data;
      loading.dismiss();
    });
  }

  async submitForm(formData: NgForm) {
    this.api.transferPrescription(formData, this.patient_id,this.delivery);
  }

  timeBtnClick(value) {
    let new_date = this.dateTimeService.getDateTime(value);
    var element = document.getElementById('pickup');
    element.setAttribute('value', new_date);
  }

  patientSelect(value) {
    this.patient_id = value;
  }

  changeColor(id: string) {
    this.dateTimeService.changeColor(id);
  }

  updateDelivery() {
    console.log('Cucumbers new state:' + this.delivery);
  }
  async presentModal() {
    const modal = await this.modalController.create({
      component: AddPatientPage
    });
    return await modal.present();
  }


}
