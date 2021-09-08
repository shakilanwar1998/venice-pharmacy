import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ApiService } from 'src/app/services/api/api.service';
import { Observable } from 'rxjs/Observable';
@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  pharmacy_id =  sessionStorage.getItem('pharmacy_id');
  result: Observable<any>;
  pharmacy: any = {};
  constructor(private alertService:AlertService,private api: ApiService) { }

  ngOnInit() {
    this.result = this.api.getPharmacy(this.pharmacy_id);
    this.result.subscribe(data => {
      this.pharmacy = data;
      sessionStorage.setItem('pharmacy_email',this.pharmacy.email);
      sessionStorage.setItem('pharmacy_website',this.pharmacy.website);
      sessionStorage.setItem('pharmacy_phone',this.pharmacy.contact);
    });
  }

  async actionSheet(value){
    this.alertService.tabAction(value);
  }

}
