import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/services/alert/alert.service';

@Component({
  selector: 'app-deals',
  templateUrl: './deals.page.html',
  styleUrls: ['./deals.page.scss'],
})
export class DealsPage implements OnInit {

  constructor(private alertService: AlertService,) { }

  ngOnInit() {
  }

  async actionSheet(value) {
    this.alertService.tabAction(value);
  }


}
