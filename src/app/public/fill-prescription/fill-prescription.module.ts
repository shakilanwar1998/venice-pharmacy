import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { RegisterPage } from 'src/app/public/register/register.page';
import { IonicModule } from '@ionic/angular';

import { FillPrescriptionPage } from './fill-prescription.page';

const routes: Routes = [
  {
    path: '',
    component: FillPrescriptionPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FillPrescriptionPage]
})
export class FillPrescriptionPageModule {}
