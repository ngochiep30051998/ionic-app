import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, MenuController, LoadingController, ToastController } from '@ionic/angular';
import * as firebase from 'firebase';
import { IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HelperService } from 'src/app/services/helper.service';
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
    public firebaseService: FirebaseService,
    public helperService: HelperService,
    public router: Router,
    public toastCtrl: ToastController,

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
      this.helperService.showLoading();
      const res = await this.authService.register(this.onRegisterForm.value.email, this.onRegisterForm.value.password);
      const currentUser: any = await this.authService.getCurrentUser();
      await currentUser.updateProfile({
        displayName: this.onRegisterForm.value.fullName,
      });
      const newUser: IUser = {
        email: currentUser.email,
        displayName: this.onRegisterForm.value.fullName,
        photoURL: currentUser.photoURL,
        phoneNumber: currentUser.phoneNumber,
        uid: currentUser.uid,
        providerId: currentUser.providerId,
        // isAdmin: true
      };
      // this.firebaseService.insertRef('/users', newUser);
      const register = await this.firebaseService.insertRefWithId('/userInfo', res.user.uid, newUser);
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        closeButtonText: 'Đóng',
        message: 'Đăng ký thành công.',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
      await this.loginWithEmail(this.onRegisterForm.value.email, this.onRegisterForm.value.password);
      console.log(res);
    } catch (e) {
      console.log(e);
      this.helperService.hideLoading();
      this.authService.handleErrors(e);
    } finally {
      this.helperService.hideLoading();
    }
  }

  async loginWithEmail(email: string, password: string) {
    try {
      await this.helperService.showLoading();
      const res = await this.authService.loginWithEmail(email, password);
      console.log(res);
      const user: IUser = {
        email: res.user.email,
        displayName: res.user.displayName,
        phoneNumber: res.user.phoneNumber,
        photoURL: res.user.photoURL,
        providerId: res.user.providerId,
        uid: res.user.uid
      };
      this.authService.updateUser(user);
      // loader.dismiss();
      if (res.additionalUserInfo.isNewUser) {
        this.firebaseService.insertRef('/users', user);
      }
      this.router.navigateByUrl('/home-results');
    } catch (e) {
      console.log(e);
      this.helperService.hideLoading();
      this.authService.handleErrors(e);
    } finally {
      this.helperService.hideLoading();
    }
  }
  // // //
  goToLogin() {
    this.navCtrl.navigateRoot('/login');
  }
}
