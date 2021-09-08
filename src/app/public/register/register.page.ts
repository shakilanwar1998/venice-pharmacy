import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { NgForm } from '@angular/forms';
import { AuthenticationService } from 'src/app/services/auth/authentication.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  id = sessionStorage['pharmacy_id'];
  image: any;
  public base64Image: string;
  constructor(
    private router: Router,
    public modalController: ModalController,
    private authService: AuthenticationService,
  ) { }

  regForm(formData: NgForm) {
    this.authService.register(formData);
  }

  ngOnInit() {
  }

  backClick() {
    this.router.navigate(['/login']);
  }
  regloginClick() {
    this.router.navigate(['/login']);
  }

}
