import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, MenuController, ToastController, AlertController, LoadingController, PopoverController } from '@ionic/angular';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { errorStatus } from 'src/app/constants/errors-status';
import { IGoogleUser, IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public onLoginForm: FormGroup;

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private helperService: HelperService,
    public popoverCtrl: PopoverController,
    public firebaseService: FirebaseService
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
  }

  ngOnInit() {

    this.onLoginForm = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }

  async forgotPass() {
    const alert = await this.alertCtrl.create({
      header: 'Quên mật khẩu?',
      message: 'Nhập địa chỉ email để nhận đường dẫn tạo mật khẩu mới.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Huỷ',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Xác nhận',
          handler: async () => {
            try {
              const loader = this.helperService.showLoading();
              const l = (await loader).onWillDismiss();
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email đã được gửi.',
                duration: 3000,
                position: 'bottom'
              });
              toast.present();
            } catch (e) {
              console.log(e);
            } finally {
              this.helperService.hideLoading();
            }
          }
        }
      ]
    });

    await alert.present();
  }

  // // //
  goToRegister() {
    this.router.navigate(['/register']);
  }

  goToHome() {
    this.navCtrl.navigateRoot('/home-results');
  }

  async loginWithEmail() {
    try {
      await this.helperService.showLoading();
      const res = await this.authService.loginWithEmail(this.onLoginForm.value.email, this.onLoginForm.value.password);
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
      this.navCtrl.navigateRoot('/home-results');
    } catch (e) {
      console.log(e);
      this.helperService.hideLoading();
      this.authService.handleErrors(e);
    } finally {
      this.helperService.hideLoading();
    }
  }

  async loginWithGoogle() {
    try {
      // const loader = await this.loadingCtrl.create();
      await this.helperService.showLoading();
      const res = await this.authService.loginWithGoogle();
      const user: IUser = {
        email: res.user.email,
        displayName: res.user.displayName,
        phoneNumber: res.user.phoneNumber,
        photoURL: res.user.photoURL,
        providerId: res.user.providerId,
        uid: res.user.uid,
      };
      this.authService.updateUser(user);
      if (res.additionalUserInfo.isNewUser) {
        this.firebaseService.insertRef('/users', user);
      }
      console.log(res);
      // loader.dismiss();
      this.router.navigateByUrl('/home-results');
    } catch (e) {
      this.helperService.hideLoading();
      this.authService.handleErrors(e);
    } finally {
      this.helperService.hideLoading();
    }
  }

  public async notifications(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }
}
