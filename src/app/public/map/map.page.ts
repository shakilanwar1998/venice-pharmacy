import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api/api.service';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  id = sessionStorage['pharmacy_id'];
  result: Observable<any>;
  pharmacy: any = {};
  constructor(private loadingController:LoadingController,
    private api:ApiService,
    private alertService:AlertService) { }

  async ngOnInit() {
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

  async actionSheet(value){
    this.alertService.tabAction(value);
  }

}
