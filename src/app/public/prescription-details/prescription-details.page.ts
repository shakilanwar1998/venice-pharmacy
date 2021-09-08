import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import { LoadingController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-prescription-details',
  templateUrl: './prescription-details.page.html',
  styleUrls: ['./prescription-details.page.scss'],
})
export class PrescriptionDetailsPage implements OnInit {

  constructor(private router: Router,private route: ActivatedRoute,private loadingController: LoadingController,
  private api:ApiService,private alertService:AlertService,) { }
  public headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } };
  id:any;
  result: Observable<any>;
  patient: any = [];
  prescription: any = [];
  pharmacy_name = sessionStorage.getItem('pharmacy_name');
  async ngOnInit() {
    this.route.params.subscribe(params => {
     this.id = params['id'];
    });

    const loading = await this.loadingController.create({
      message: 'Loading data...',
    });
    await loading.present();

    this.result = this.api.getPrescriptionDetails(this.id);
    this.result.subscribe(data => {
      this.prescription = data;
      loading.dismiss();
    });
  }

  dismiss(){
    var patient = sessionStorage['patient']
    this.router.navigate(['/patient-details/'+patient+'']);
  }

  async actionSheet(value){
    this.alertService.tabAction(value);
  }

}
