import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { identity, pickBy } from 'lodash';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HelperService } from 'src/app/services/helper.service';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit, OnDestroy {
  public user: IUser;
  private userSub$: Subscription;
  public form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    private authService: AuthService,
    public router: Router,
    public helperService: HelperService,
    public angularFireAuth: AngularFireAuth,
    private fb: FormBuilder,
    private firebaseService: FirebaseService,
    public storage: AngularFireStorage,

  ) {
    this.initForm();
    this.userSub$ = this.angularFireAuth.user.pipe(user =>
      this.firebaseService.getCurrentUserFirebase(this.angularFireAuth.auth.currentUser.uid)
    ).subscribe((res: IUser) => {
      this.user = res;
      this.form.patchValue(this.user);
      console.log(this.user)
    });
  }

  ngOnInit() {
  }

  initForm() {
    this.form = this.fb.group({
      displayName: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: ['', Validators.required],
      currentPassword: ['', Validators.required],
      changePassword: [false]
    });
  }

  async sendData() {
    const loader = await this.loadingCtrl.create({
      duration: 2000
    });

    loader.present();
    loader.onWillDismiss().then(async l => {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        cssClass: 'bg-profile',
        message: 'Your Data was Edited!',
        duration: 2000,
        position: 'bottom'
      });

      toast.present();
      this.navCtrl.navigateForward('/home-results');
    });
  }

  async updateProfile() {
    try {
      this.helperService.markFormGroupTouched(this.form);
      console.log(this.form.value.changePassword)
      if (this.form.invalid) {
        return;
      }
      this.helperService.showLoading();
      const check = await this.checkPassword(this.form.value.currentPassword);
      if (check) {
        const updateDisplayName = this.angularFireAuth.auth.currentUser.updateProfile({
          displayName: this.form.value.displayName
        });
        const user: IUser = {
          displayName: this.form.value.displayName,
          email: this.angularFireAuth.auth.currentUser.email,
          uid: this.angularFireAuth.auth.currentUser.uid,
          phoneNumber: this.form.value.phoneNumber,
          photoURL: this.angularFireAuth.auth.currentUser.photoURL,
          providerId: this.user.providerId
        };
        const params = pickBy(user, identity);
        const update = this.firebaseService.updateUserInfo(params);
        if (this.form.value.changePassword) {
          const updatePassword = this.angularFireAuth.auth.currentUser.updatePassword(this.form.value.password);
          await Promise.all([updateDisplayName, update, updatePassword])
        } else {
          await Promise.all([updateDisplayName, update])
        }
        const toast = await this.toastCtrl.create({
          showCloseButton: true,
          closeButtonText: 'Đóng',
          message: 'Cập nhật thành công.',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });

        toast.present();
        this.resetForm('changePassword');
        this.resetForm('currentPassword');
      } else {
        throw {
          message: 'Mật khẩu không chính xác'
        };
      }
      // const updatePhone = await this.angularFireAuth.auth.currentUser.updatePhoneNumber(this.form.value.phoneNumber);

    } catch (e) {
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        closeButtonText: 'Đóng',
        message: e.message || 'Cập nhật thất bại, vui lòng kiểm tra lại thông tin.',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });

      toast.present();
    } finally {
      this.helperService.hideLoading();
    }
  }

  updateAvt(event) {

    if (event && event.target.files[0]) {
      this.helperService.showLoading();
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const displayImageName = Date.now().toString();
        const image = reader.result.toString();
        this.storage.ref(`/avatar/${displayImageName}`).putString(image.split(',')[1], 'base64').then(res => {
          res.ref.getDownloadURL().then(url => {
            const authUrl = this.angularFireAuth.auth.currentUser.updateProfile({
              photoURL: url
            });
            const databaseUrl = this.firebaseService.updateUserInfo({
              uid: this.angularFireAuth.auth.currentUser.uid,
              photoURL: url
            });
            Promise.all([authUrl, databaseUrl]).then(async () => {
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                closeButtonText: 'Đóng',
                message: 'Cập nhật thành công.',
                duration: 2000,
                position: 'bottom',
                color: 'success'
              });

              toast.present();
            }).catch(async (err) => {
              console.log(err);
              const toast = await this.toastCtrl.create({
                showCloseButton: true,
                closeButtonText: 'Đóng',
                message: 'Cập nhật thất bại, vui lòng kiểm tra lại thông tin.',
                duration: 2000,
                position: 'bottom',
                color: 'danger'
              });

              toast.present();
            }).finally(() => {
              this.helperService.hideLoading();
            });
          });
        }).catch(async (err) => {
          console.log(err);
          const toast = await this.toastCtrl.create({
            showCloseButton: true,
            closeButtonText: 'Đóng',
            message: 'Cập nhật thất bại, vui lòng kiểm tra lại thông tin.',
            duration: 2000,
            position: 'bottom',
            color: 'danger'
          });
        }).finally(() => {
          this.helperService.hideLoading();
        });
      };
    }
  }

  async checkPassword(password) {
    try {
      const verify = await this.angularFireAuth.auth.currentUser.reauthenticateWithCredential(
        auth.EmailAuthProvider.credential(
          this.angularFireAuth.auth.currentUser.email, password
        )
      );
      console.log(verify);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  onChangeCheckbox(event) {
    if (event) {
      this.form.addControl('password', new FormControl('', Validators.required));
      this.form.addControl('confirmPassword', new FormControl('', [Validators.required, this.helperService.matchValues('password')]));
    } else {
      this.form.removeControl('password');
      this.form.removeControl('confirmPassword');
    }
    this.form.updateValueAndValidity();
  }

  resetForm(name) {
    this.form.get(name).reset();
  }
  ngOnDestroy(): void {
    if (this.userSub$) {
      this.userSub$.unsubscribe();
    }
  }
}
