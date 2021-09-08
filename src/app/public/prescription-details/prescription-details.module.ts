import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { PrescriptionDetailsPage } from './prescription-details.page';

const routes: Routes = [
  {
    path: '',
    component: PrescriptionDetailsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [PrescriptionDetailsPage]
})
export class PrescriptionDetailsPageModule {}
