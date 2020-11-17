import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';
import { ActionSheetController, LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { auth } from 'firebase/app';
import { identity, pickBy } from 'lodash';
import { Subscription } from 'rxjs';
import { IUser } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { HelperService } from 'src/app/services/helper.service';
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
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private file: File,
    private platform: Platform,

  ) {
    this.initForm();
    this.userSub$ = this.angularFireAuth.user.pipe(user =>
      this.firebaseService.getCurrentUserFirebase(this.angularFireAuth.auth.currentUser.uid)
    ).subscribe((res: IUser) => {
      this.user = res;
      this.form.patchValue(this.user);
      if (this.user.providerId !== 'google.com') {
        this.form.get('currentPassword').setValidators([Validators.required]);
      }
      console.log(this.user);
    });
  }

  ngOnInit() {
  }

  initForm() {
    this.form = this.fb.group({
      displayName: ['', Validators.required],
      email: [{ value: '', disabled: true }, Validators.required],
      phoneNumber: ['', Validators.required],
      currentPassword: [''],
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
      console.log(this.form.value.changePassword);
      if (this.form.invalid) {
        return;
      }
      this.helperService.showLoading();
      const check = this.user.providerId === 'google.com' ? true : await this.checkPassword(this.form.value.currentPassword);
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
          await Promise.all([updateDisplayName, update, updatePassword]);
        } else {
          await Promise.all([updateDisplayName, update]);
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

  async pickImage(sourceType) {
    try {
      const options: CameraOptions = {
        quality: 100,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE
      };
      const imageData = await this.camera.getPicture(options);
      const currentName = imageData.substr(imageData.lastIndexOf('/') + 1);
      const correctPath = imageData.substr(0, imageData.lastIndexOf('/') + 1);
      const displayImageName = Date.now().toString();
      this.helperService.showLoading();
      const image = await this.file.readAsDataURL(correctPath, currentName);
      const res = await this.storage.ref(`/avatar/${displayImageName}`).putString(image.split(',')[1], 'base64');
      const url = await res.ref.getDownloadURL();
      const authUrl = this.angularFireAuth.auth.currentUser.updateProfile({
        photoURL: url
      });
      const databaseUrl = this.firebaseService.updateUserInfo({
        uid: this.angularFireAuth.auth.currentUser.uid,
        photoURL: url
      });

      await Promise.all([authUrl, databaseUrl]);
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        closeButtonText: 'Đóng',
        message: 'Cập nhật thành công.',
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      toast.present();
      this.helperService.hideLoading();
    } catch (e) {
      this.helperService.hideLoading();
      console.log(e);
      if(e === 'No Image Selected'){
        return;
      }
      const toast = await this.toastCtrl.create({
        showCloseButton: true,
        closeButtonText: 'Đóng',
        message: 'Cập nhật thất bại, vui lòng kiểm tra lại thông tin.',
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      toast.present();
    }

  }

  async selectImage() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Chọn ảnh từ',
      buttons: [{
        text: 'Thư viện',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
        }
      },
      {
        text: 'Máy ảnh',
        handler: () => {
          this.pickImage(this.camera.PictureSourceType.CAMERA);
        }
      },
      {
        text: 'Huỷ',
        role: 'cancel'
      }
      ]
    });
    await actionSheet.present();
  }
  ngOnDestroy(): void {
    if (this.userSub$) {
      this.userSub$.unsubscribe();
    }
  }
}
