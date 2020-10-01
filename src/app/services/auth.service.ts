import { Injectable } from '@angular/core';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { NavController } from '@ionic/angular';

import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public navCtrl: NavController,
    private googlePlus: GooglePlus
  ) { }

  register(email, password) {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  }
  loginWithEmail(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  loginWithGoogle(){
    return this.googlePlus.login({});
  }
  async logout() {
    await firebase.auth().signOut();
    this.navCtrl.navigateRoot('/');
  }
}
