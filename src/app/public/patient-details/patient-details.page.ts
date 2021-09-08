import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { LoadingController } from '@ionic/angular';
import { ConfigService } from 'src/app/services/config/config.service';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.page.html',
  styleUrls: ['./patient-details.page.scss'],
})
export class PatientDetailsPage implements OnInit {
  constructor(private router: Router,private route: ActivatedRoute,private loadingController: LoadingController,
  private config: ConfigService,private alertService:AlertService,
  public authService: AuthenticationService,private api:ApiService) { }
  public headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
  id:any;
  result: Observable<any>;
  patient: any = [];
  prescriptions: any = [];
  baseUrl = this.config.baseUrl;
  dob:any;
  prescription_details:any = {
    showDetails : false,
    icon : "arrow-dropdown"
  };

  patient_detils:any = {
    showDetails : false,
    icon : "arrow-dropdown"
  };


  async ngOnInit() {
    this.route.params.subscribe(params => {
     this.id = params['id'];
    });

    sessionStorage.setItem('patient',this.id);

    const loading = await this.loadingController.create({
      message: 'Loading data...',
    });
    await loading.present();

    this.result = this.api.getPatient(this.id);
    this.result.subscribe(data => {
      this.patient = data;
      let date = new Date(this.patient.dob);
      let new_dob = date.getDate() +"-"+date.getMonth()+1+"-"+date.getFullYear();
      this.dob = new_dob;
      loading.dismiss();
    });

    this.result = this.api.getPatientPrescriptions(this.id);
    this.result.subscribe(data => {
      this.prescriptions = data;
      loading.dismiss();
    });

  }

  toggleDetails(data){
    if(data == 'prescription_details'){
      if (this.prescription_details.showDetails) {
          this.prescription_details.showDetails = false;
          this.prescription_details.icon = "arrow-dropdown";
      } else {
          this.prescription_details.showDetails = true;
          this.prescription_details.icon = "arrow-dropup";
      }
    }

    if(data == 'patient_detils'){
      if (this.patient_detils.showDetails) {
          this.patient_detils.showDetails = false;
          this.patient_detils.icon = "arrow-dropdown";
      } else {
          this.patient_detils.showDetails = true;
          this.patient_detils.icon = "arrow-dropup";
      }
    }

  }

  clickPrescription(id){
    this.router.navigate(['/prescription-details/'+id+'']);
  }

  async actionSheet(value){
    this.alertService.tabAction(value);
  }

}
