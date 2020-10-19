import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { HelperService } from './helper.service';

import * as firebase from 'firebase';

import * as moment from 'moment';
import { ICart } from '../interfaces/cart.interfaces';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private db: AngularFireDatabase,
    private helperService: HelperService,
  ) { }

  public insertRef(ref: string, value: any) {
    return this.db.list(ref).push(value);
  }

  public insertRefWithId(ref: string, id: string, value: any) {
    return this.db.object(`${ref}/${id}`).set(value);
  }

  getMenuById(id) {
    return this.db.object(`/menus/${id}`).snapshotChanges().pipe(
      map(snap => this.helperService.convertMenu(snap))
    );
  }

  getListMenu(start, end) {
    return this.db.list('/menus', ref => ref.orderByKey().startAt(start).endAt(end)).snapshotChanges().pipe(
      map(
        x => x.map(snap => this.helperService.convertMenu(snap))
      )
    );
  }

  getProductById(menuId, meal, prodId) {
    return this.db.object(`menus/${menuId}/${meal}/${prodId}`).snapshotChanges().pipe(
      map(
        snap => {
          console.log(snap.payload.val())
          const product = this.helperService.snap2Object(snap);
          product.photos = this.helperService.object2Arr(product.photos);
          return product;
        }
      )
    );
  }

  getTime() {
    // const session = this.db.object('sessions');
    // session.p
    return moment(firebase.database.ServerValue.TIMESTAMP).format()
    // return this.db.
  }

  getUserInfo(uId) {
    return new Promise((resolve, reject) => {
      return this.db.object(`userInfo/${uId}`).valueChanges().subscribe(res => {
        resolve(res);
      }, err => {
        reject(err);
      });
    });
  }

  createBill(cart: ICart) {
    const id = this.db.createPushId();
    cart.date = firebase.database.ServerValue.TIMESTAMP;
    return this.db.object(`/bills/${id}`).set(cart);
  }
}
