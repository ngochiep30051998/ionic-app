import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NavController } from '@ionic/angular';

import * as firebase from 'firebase';
import { IGoogleUser, IUser } from '../interfaces/user.interface';
import { Storage } from '@ionic/storage';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: firebase.User;
  private user$: Subject<IUser> = new Subject();
  constructor(
    public navCtrl: NavController,
    private googlePlus: GooglePlus,
    private storage: Storage
  ) { }

  register(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }
  loginWithEmail(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  async loginWithGoogle() {
    try {
      const googleUser: IGoogleUser = await this.googlePlus.login({
        webClientId: environment.googleWebClientId,
        offline: true
      });
      const res = await firebase.auth().signInWithCredential(
        firebase.auth.GoogleAuthProvider.credential(googleUser.idToken, googleUser.accessToken)
      );
      return res;
    } catch (e) {
      Promise.reject(e);
    }
  }
  async logout() {
    localStorage.clear();
    await firebase.auth().signOut();
    this.navCtrl.navigateRoot('/');
  }

  getCurrentUser(): IUser {
    return JSON.parse(localStorage.getItem('user'));
  }

  getCurrentFirebaseUser(): firebase.User {
    return firebase.auth().currentUser;
  }

  updateUser(user: IUser) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user$.next(user);
  }

  getUserInfo() {
    return this.user$.asObservable();
  }
}
