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
  public isCheckout: boolean;
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
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.isCheckout = this.router.getCurrentNavigation().extras.state.checkout;
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);

  }

  ngOnInit() {

    this.onLoginForm = this.formBuilder.group({
      'email': ['hiep2@yopmail.com', Validators.compose([
        Validators.required
      ])],
      'password': ['123123', Validators.compose([
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
          placeholder: 'Email',
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
          handler: async (data) => {
            try {
              if (data && data.email && this.helperService.validateEmail(data.email)) {
                await this.helperService.showLoading();
                const res = await this.authService.resetPassword(data.email);
                const toast = await this.toastCtrl.create({
                  showCloseButton: true,
                  message: 'Email đã được gửi.',
                  duration: 2000,
                  position: 'bottom',
                  closeButtonText: 'Đóng',
                });
                toast.present();
                return res;
              } else {
                this.showErrorToast('Email không đúng định dạng');
                return false;
              }

            } catch (e) {
              this.authService.handleErrors(e);
              return false;
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
      const moreInfo: any = await this.firebaseService.getUserInfo(res.user.uid);
      const user: IUser = {
        email: res.user.email,
        displayName: res.user.displayName,
        phoneNumber: res.user.phoneNumber,
        photoURL: res.user.photoURL,
        providerId: res.user.providerId,
        uid: res.user.uid,
        ...moreInfo
      };

      this.authService.updateUser(user);
      // loader.dismiss();
      if (res.additionalUserInfo.isNewUser) {
        this.firebaseService.insertRefWithId('/userInfo', res.user.uid, user);
      }
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        closeButtonText: 'Đóng',
        message: 'Đăng nhập thành công.',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
      if (this.isCheckout) {
        this.navCtrl.back();
      } else {
        this.router.navigateByUrl('/home-results');
      }
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
      const moreInfo: any = await this.firebaseService.getUserInfo(res.user.uid);
      const user: IUser = {
        email: res.user.email,
        displayName: res.user.displayName,
        phoneNumber: res.user.phoneNumber,
        photoURL: res.user.photoURL,
        providerId: res.user.providerId,
        uid: res.user.uid,
        ...moreInfo
      };
      this.authService.updateUser(user);
      if (res.additionalUserInfo.isNewUser) {
        this.firebaseService.insertRefWithId('/userInfo', res.user.uid, user);

      }
      console.log(res);
      // loader.dismiss();
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        closeButtonText: 'Đóng',
        message: 'Đăng nhập thành công.',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
      if (this.isCheckout) {
        this.navCtrl.back();
      } else {
        this.router.navigateByUrl('/home-results');
      }
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

  async showErrorToast(data: any) {
    const toast = await this.toastCtrl.create({
      message: data,
      duration: 3000,
      position: 'bottom'
    });

    toast.present();
  }
}
