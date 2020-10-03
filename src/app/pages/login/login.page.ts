import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, MenuController, ToastController, AlertController, LoadingController } from '@ionic/angular';
import { IGoogleUser, IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';

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
    private router: Router
  ) { }

  ionViewWillEnter() {
    this.menuCtrl.enable(false);
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
      header: 'Forgot Password?',
      message: 'Enter you email address to send a reset link password.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Confirm',
          handler: async () => {
            const loader = await this.loadingCtrl.create({
              duration: 2000
            });

            loader.present();
            loader.onWillDismiss().then(async l => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                message: 'Email was sended successfully.',
                duration: 3000,
                position: 'bottom'
              });

              toast.present();
            });
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
      const loader = await this.loadingCtrl.create({ duration: 3000 });
      loader.present();
      const res = await this.authService.loginWithEmail(this.onLoginForm.value.email, this.onLoginForm.value.password);
      console.log(res);
      const user: IUser = {
        email: this.onLoginForm.value.email,
        displayName: res.user.displayName,
        phoneNumber: res.user.phoneNumber,
        photoURL: res.user.photoURL,
        providerId: res.user.providerId,
        uid: res.user.uid
      };
      this.authService.updateUser(user);
      loader.dismiss();
      // loader.dismiss();
      this.navCtrl.navigateRoot('/home-results');
    } catch (e) {
      console.log(e);
    }
  }

  async loginWithGoogle() {
    try {
      // const loader = await this.loadingCtrl.create();
      const loader = await this.loadingCtrl.create({ duration: 3000 });
      loader.present();
      const res = await this.authService.loginWithGoogle();
      const user: IUser = {
        email: this.onLoginForm.value.email,
        displayName: res.user.displayName,
        phoneNumber: res.user.phoneNumber,
        photoURL: res.user.photoURL,
        providerId: res.user.providerId,
        uid: res.user.uid,
      };
      this.authService.updateUser(user);
      console.log(res);
      loader.dismiss();

      // loader.dismiss();
      this.navCtrl.navigateRoot('/home-results');
    } catch (e) {
      console.log(e);
    } finally {
    }
  }
}
