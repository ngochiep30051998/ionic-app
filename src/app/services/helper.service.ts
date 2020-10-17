import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';
import { SnapshotAction } from '@angular/fire/database';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { ICalendar } from '../interfaces/commont.interface';
import * as _ from 'lodash';
import { FormGroup } from '@angular/forms';

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
    const currentDate = new Date('10/14/2020');
    const crr = formatDate(new Date(), 'MM/dd/yyyy', 'en');

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

}
