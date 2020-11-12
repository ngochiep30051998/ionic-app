import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { SnapshotAction } from '@angular/fire/database';
import { FormGroup } from '@angular/forms';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';
import { ICalendar } from '../interfaces/common.interfaces';
import { IMenu } from '../interfaces/menu.interfaces';
import { IProduct } from '../interfaces/products.interface';

@Injectable({
  providedIn: 'root'
})
export class HelperService {
  public loader: HTMLIonLoadingElement;
  public toast: any;
  constructor(
    public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) { }
  
  markFormGroupTouched(formGroup) {
    (Object as any).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  async showLoading(message?, time?) {
    if (!this.loader) {
      this.loader = await this.loadingCtrl.create({ duration: time || 10000, message });
      return this.loader.present();
    }
  }

  async hideLoading() {
    if (this.loader) {
      await this.loader.dismiss();
      this.loader = null;
    }
  }

  async showAlert(header?: string, message?: string, subHeader?: string, cssClass?: string, buttons?: any[], inputs?: any[]) {
    if (!buttons) {
      buttons = ['Xác nhận'];
    }
    const alert = await this.alertController.create({
      cssClass: cssClass,
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons,
      inputs: inputs
    });

    return await alert.present();
  }

  getNameOfDate(date) {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[date.getDay()];
  }

  initDate(): ICalendar[] {
    let currentDate, crr;

    if (environment.curentDate) {
      currentDate = new Date(environment.curentDate);
      crr = formatDate(new Date(environment.curentDate), 'MM/dd/yyyy', 'en')
    } else {
      currentDate = new Date();
      crr = formatDate(new Date(), 'MM/dd/yyyy', 'en');
    }
    // const currentDate = new Date();

    const first = currentDate.getDate() - currentDate.getDay();
    const firstday = new Date(currentDate.setDate(first));
    const arr: ICalendar[] = [];
    for (let i = 0; i < 5; i++) {
      const date = formatDate(firstday.setDate(firstday.getDate() + 1), 'MM/dd/yyyy', 'en');
      const menu: ICalendar = {
        id: date,
        title: this.getNameOfDate(new Date(date)),
        isCurrent: crr === date
      };
      arr.push(menu);
    }
    return arr;
  }

  object2ArrMerge(obj) {
    return _.map(obj, (value, key) => ({ key, ...value }));
  }

  object2Arr(obj) {
    return _.map(obj, (value, key) => ({ key, value }));
  }

  snap2Object(snap: SnapshotAction<any>) {
    try {
      const value = snap.payload.val();
      return { key: snap.payload.key, ...value };
    } catch (e) {
      console.log(e);
      return snap;
    }
  }

  convertMenu(snap: SnapshotAction<any>) {
    const ob = this.snap2Object(snap);
    for (const key in ob) {
      if (ob.hasOwnProperty(key) && key !== 'key') {
        ob[key] = this.object2ArrMerge(ob[key]);
        ob[key] = ob[key].map(p => {
          p.photos = this.object2Arr(p.photos);
          return p;
        });
      }
    }
    return ob;
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }

  counter(product: IProduct, menu: IMenu) {
    let arr = [];

    if (menu) {
      const p: IProduct = menu[product.meal].find(x => x.key === product.key);
      if (p) {
        arr = Array.from({ length: p.amount }, (_, i) => i + 1);
      }
    }
    return arr;
  }

  generateRandomUID(length: number = 20) {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

}
