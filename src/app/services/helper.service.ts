import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';

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
      this.loader.present();
      return this.loader;
    }
  }

  hideLoading() {
    if (this.loader) {
      this.loader.dismiss();
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

  initMenu() {

  }
}
