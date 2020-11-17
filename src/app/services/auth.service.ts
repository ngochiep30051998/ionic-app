import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { auth } from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { errorStatus } from '../constants/errors-status';
// import * as firebase from 'firebase';
import { IGoogleUser, IUser } from '../interfaces/user.interface';
import { HelperService } from './helper.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user$: BehaviorSubject<IUser> = new BehaviorSubject(null);
  constructor(
    public navCtrl: NavController,
    private googlePlus: GooglePlus,
    private storage: Storage,
    public helperService: HelperService,
    private angularFireAuth: AngularFireAuth,
    private router: Router
  ) { }

  register(email, password) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
  }
  loginWithEmail(email, password) {
    // return firebase.auth().signInWithEmailAndPassword(email, password);
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async loginWithGoogle() {
    try {
      const googleUser: IGoogleUser = await this.googlePlus.login({
        webClientId: environment.googleWebClientId,
        offline: true
      });
      const res = await this.angularFireAuth.auth.signInWithCredential(
        auth.GoogleAuthProvider.credential(googleUser.idToken, googleUser.accessToken)
      );
      return res;
    } catch (e) {
      Promise.reject(e);
    }
  }
  async logout() {
    await this.angularFireAuth.auth.signOut();
    this.updateUser(null);
    this.router.navigate(['/home-results']);
  }

  getCurrentUser() {
    return new Promise((resolve, reject) => {
      return this.angularFireAuth.user.subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }
  // getCurrentFirebaseUser(): firebase.User {
  //   return firebase.auth().currentUser;
  // }

  updateUser(user: IUser) {
    this.user$.next(user);
  }

  getUserInfo() {
    return this.user$.asObservable();
  }
  handleErrors(e) {
    if (e && e.code) {
      let title = 'Đăng nhập thất bại';
      switch (e.code) {
        case errorStatus.wrongPassword:
          this.helperService.showAlert(title, `Mật khẩu không hợp lệ hoặc người dùng không có mật khẩu,
           thử lại với phương thức đăng nhập khác.`);
          break;
        case errorStatus.userNotFound:
          this.helperService.showAlert(title, 'Không tìm thấy tài khoản, vui lòng kiểm tra lại.');
          break;
        case errorStatus.existedEmail:
          title = 'Đăng ký thất bại';
          this.helperService.showAlert(title, 'Email đã được sử dụng.');
          break;
        case errorStatus.passwordLength:
          title = 'Đăng ký thất bại';
          this.helperService.showAlert(title, 'Mật khẩu phải chứa ít nhất 6 ký tự.');
          break;
      }
    }
  }

  getIdToken() {
    return this.angularFireAuth.auth.currentUser.getIdToken();
  }

  resetPassword(email) {
    return this.angularFireAuth.auth.sendPasswordResetEmail(email);
  }
}
