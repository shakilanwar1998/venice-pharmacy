import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'locations',
    pathMatch: 'full'
  },

  {
    path: 'fill-prescription',
    loadChildren: './public/fill-prescription/fill-prescription.module#FillPrescriptionPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'login',
    loadChildren: './public/login/login.module#LoginPageModule',
  },
  {
    path: 'register',
    loadChildren: './public/register/register.module#RegisterPageModule',
  },

  {
    path: 'refill-prescription',
    loadChildren: './public/refil-prescription/refil-prescription.module#RefilPrescriptionPageModule' ,
    canActivate: [AuthGuardService]
  },
  {
    path: 'locations',
    loadChildren: './public/locations/locations.module#LocationsPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'transfer-prescription',
    loadChildren: './public/transfer-prescription/transfer-prescription.module#TransferPrescriptionPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'home',
    loadChildren: './public/home/home.module#HomePageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'add-patient',
    loadChildren: './public/add-patient/add-patient.module#AddPatientPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'patients',
    loadChildren: './public/patients/patients.module#PatientsPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'patient-details/:id',
    loadChildren: './public/patient-details/patient-details.module#PatientDetailsPageModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'prescription-details/:id',
    loadChildren: './public/prescription-details/prescription-details.module#PrescriptionDetailsPageModule',
    canActivate: [AuthGuardService]
  },
  { path: 'about', loadChildren: './public/about/about.module#AboutPageModule' },
  { path: 'consultation', loadChildren: './public/consultation/consultation.module#ConsultationPageModule' },
  { path: 'map', loadChildren: './public/map/map.module#MapPageModule' },
  { path: 'chatting', loadChildren: './public/chatting/chatting.module#ChattingPageModule' },
  { path: 'refer', loadChildren: './public/refer/refer.module#ReferPageModule' },
  { path: 'deals', loadChildren: './public/deals/deals.module#DealsPageModule' },
  { path: 'settings', loadChildren: './public/settings/settings.module#SettingsPageModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
