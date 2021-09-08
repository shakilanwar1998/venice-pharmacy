import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { NgForm } from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { DatetimeService } from 'src/app/services/datetime/datetime.service';

@Component({
  selector: 'app-consultation',
  templateUrl: './consultation.page.html',
  styleUrls: ['./consultation.page.scss'],
})
export class ConsultationPage implements OnInit {

  preferred_text:any = {
    showDetails : false,
  };
  preferred : boolean;
  pharmacy_name = sessionStorage.getItem('pharmacy_name');
  logo = sessionStorage.getItem('logo');
  constructor(private alertService:AlertService,private api:ApiService,private dateTimeService: DatetimeService) { }

  ngOnInit() {
  }

  submitForm(formData:NgForm){
    this.api.submitConsultation(formData);
  }

  async actionSheet(value){
    this.alertService.tabAction(value);
  }

  setPreferred(){
    if (this.preferred_text.showDetails) {
        this.preferred_text.showDetails = false;
    } else {
        this.preferred_text.showDetails = true;
    }
  }

  timeBtnClick(value) {
    let new_date = this.dateTimeService.getDateTime(value);
    var element = document.getElementById('pickup');
    element.setAttribute('value', new_date);
  }
  changeColor(id: string) {
    this.dateTimeService.changeColor(id);
  }

}
