import { AfterContentInit, AfterViewInit, Component, ViewChild } from '@angular/core';
import {
  NavController,
  AlertController,
  MenuController,
  ToastController,
  PopoverController,
  ModalController, IonSlides
} from '@ionic/angular';

// Modals
import { SearchFilterPage } from '../../pages/modal/search-filter/search-filter.page';
import { ImagePage } from './../modal/image/image.page';
// Call notifications test by Popover and Custom Component.
import { NotificationsComponent } from './../../components/notifications/notifications.component';
import { ICalendar } from 'src/app/interfaces/commont.interface';
import { HelperService } from 'src/app/services/helper.service';

@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage {
  @ViewChild('Slides') slides: IonSlides;

  public searchKey = '';
  public yourLocation = '123 Test Street';
  public calender: ICalendar[] = [];
  public segment = '';
  public slideOpts = {
    effect: 'flip',
    zoom: false
  };
  public segmentIndex = 0;
  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public helperService: HelperService
  ) {
    this.calender = this.helperService.initDate().slice(1, 6);
    const index = this.calender.findIndex(x => x.isCurrent);
    if (index > -1) {
      this.segmentIndex = index;
      this.segment = this.calender[index].id;
    } else {
      this.segment = this.calender[0].id;
    }
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.drag(this.segmentIndex);

  }
  settings() {
    this.navCtrl.navigateForward('settings');
  }

  async alertLocation() {
    const changeLocation = await this.alertCtrl.create({
      header: 'Change Location',
      message: 'Type your Address.',
      inputs: [
        {
          name: 'location',
          placeholder: 'Enter your new Location',
          type: 'text'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Change',
          handler: async (data) => {
            console.log('Change clicked', data);
            this.yourLocation = data.location;
            const toast = await this.toastCtrl.create({
              message: 'Location was change successfully',
              duration: 3000,
              position: 'top',
              closeButtonText: 'OK',
              showCloseButton: true
            });

            toast.present();
          }
        }
      ]
    });
    changeLocation.present();
  }

  async searchFilter() {
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage
    });
    return await modal.present();
  }

  async presentImage(image: any) {
    const modal = await this.modalCtrl.create({
      component: ImagePage,
      componentProps: { value: image }
    });
    return await modal.present();
  }

  public async notifications(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: NotificationsComponent,
      event: ev,
      animated: true,
      showBackdrop: true
    });
    return await popover.present();
  }

  update(i) {
    this.slides.slideTo(i).then((res) => console.log('responseSlideTo', res));
  }

  seg(event) {
    this.segment = event.detail.value;
  }
  preventDefault(e) {
    e.preventDefault();
  }
  async change(e) {
    const index = await this.slides.getActiveIndex();
    this.segment = this.calender[index].id;
    this.drag(index);
  }

  drag(i) {
    let distanceToScroll = 0;
    for (const index in this.calender) {
      // tslint:disable-next-line: radix
      if (parseInt(index) < i) {
        distanceToScroll = distanceToScroll + document.getElementById('seg_' + index).offsetWidth + 24;
      }
    }
    document.getElementById('dag').scrollLeft = distanceToScroll;
  }
}
