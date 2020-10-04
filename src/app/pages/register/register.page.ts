import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, MenuController, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';
import { IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
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
    private authService: AuthService,
    public firebaseService: FirebaseService
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
      const currentUser = this.authService.getCurrentFirebaseUser();
      const update = await currentUser.updateProfile({
        displayName: this.onRegisterForm.value.fullName,
      });
      const newUser: IUser = {
        email: currentUser.email,
        displayName: this.onRegisterForm.value.fullName,
        photoURL: currentUser.photoURL,
        phoneNumber: currentUser.phoneNumber,
        uid: currentUser.uid,
        providerId: currentUser.providerId
      };
      this.firebaseService.insertRef('/users', newUser);
      console.log(res);
      loader.present();
      loader.onWillDismiss().then(() => {
        this.navCtrl.navigateRoot('/home-results');
      });
    } catch (e) {
      console.log(e);
      this.authService.handleErrors(e);
    }
  }

  // // //
  goToLogin() {
    this.navCtrl.navigateRoot('/login');
  }
}
