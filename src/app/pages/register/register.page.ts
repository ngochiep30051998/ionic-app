import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public onRegisterForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
  }

  ngOnInit() {
    this.onRegisterForm = this.formBuilder.group({
      'fullName': [null, Validators.compose([
        Validators.required
      ])],
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  async signUp() {
    try {
      const loader = await this.loadingCtrl.create({
        duration: 2000
      });
      const params = {
        email: this.onRegisterForm.value.email,
        password: this.onRegisterForm.value.password
      };
      const res = await this.authService.register(this.onRegisterForm.value.email, this.onRegisterForm.value.password);
      const currentUser = this.authService.getCurrentUser();
      const update = await currentUser.updateProfile({
        displayName: this.onRegisterForm.value.fullName,
      });
      console.log(res);
      loader.present();
      loader.onWillDismiss().then(() => {
        this.navCtrl.navigateRoot('/home-results');
      });
    } catch (e) {
      console.log(e);
    }
  }

  // // //
  goToLogin() {
    this.navCtrl.navigateRoot('/');
  }
}
