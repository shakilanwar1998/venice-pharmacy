import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { TransferPrescriptionPage } from './transfer-prescription.page';

const routes: Routes = [
  {
    path: '',
    component: TransferPrescriptionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [TransferPrescriptionPage]
})
export class TransferPrescriptionPageModule {}
