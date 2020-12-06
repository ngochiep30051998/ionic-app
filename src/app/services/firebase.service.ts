import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import * as firebase from 'firebase';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { BILL_STATUS } from '../constants/common';
import { ICart } from '../interfaces/cart.interfaces';
import { IUser } from '../interfaces/user.interface';
import { HelperService } from './helper.service';


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
      map(snap => this.helperService.convertMenu(snap, id))
    );
  }

  getListMenu(start, end) {
    return this.db.list('/menus', ref => ref.orderByKey().startAt(start).endAt(end)).snapshotChanges().pipe(
      map(
        x => x.map(snap => this.helperService.convertMenu(snap, snap.key))
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
          product.menuId = menuId;
          product.meal = meal;
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
    cart.id = id;
    return this.db.object(`/bills/${id}`).set(cart);
  }

  getOrderHistory(user: IUser, limit = 10) {
    return this.db.list('/bills', query => query.orderByChild('user/uid').equalTo(user.uid).limitToLast(limit)).valueChanges().pipe(
      map(value => value.reverse())
    );
  }

  updateUserInfo(user) {
    return this.db.object(`userInfo/${user.uid}`).update(user);
  }

  addFavorite(user, productId) {
    return this.db.list(`userInfo/${user.uid}/favorites`).push(productId);
  }

  removeFavorite(user, key) {
    return this.db.object(`userInfo/${user.uid}/favorites/${key}`).remove();
    // return new Promise((resolve, reject) => {
    //   this.db.object(`userInfo/${user.uid}/favorites/${key}`).valueChanges().subscribe(res => {
    //     resolve(res);
    //   }, err => {
    //     reject(err)
    //   })
    // });
  }
  getCurrentUserFirebase(uid) {
    return this.db.object(`userInfo/${uid}`).valueChanges();
  }

  getCategories() {
    return this.db.list('/categories').snapshotChanges().pipe(map((snap: any) => {

      return snap = snap.map((x: any) => {
        const data = {
          key: x.payload.key,
          categoryName: x.payload.val().categoryName
        };
        return data;
      });
    }));
  }

  cancelOrder(cart: ICart) {
    return this.db.object(`bills/${cart.id}`).update({
      updatedAt: firebase.database.ServerValue.TIMESTAMP,
      status: BILL_STATUS.canceled.key
    });
  }
}
