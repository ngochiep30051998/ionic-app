import { AfterContentInit, AfterViewInit, Component, OnChanges, ViewChild } from '@angular/core';
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
import { ICalendar, IFilter } from 'src/app/interfaces/common.interfaces';
import { HelperService } from 'src/app/services/helper.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { IMenu } from 'src/app/interfaces/menu.interfaces';
import { FirebaseService } from 'src/app/services/firebase.service';
import * as moment from 'moment';
import { CartService } from 'src/app/services/cart.service';
import { Cart, ICart } from 'src/app/interfaces/cart.interfaces';
import { IProduct } from 'src/app/interfaces/products.interface';
import { STATUS_FILTER } from 'src/app/constants/common';
@Component({
  selector: 'app-home-results',
  templateUrl: './home-results.page.html',
  styleUrls: ['./home-results.page.scss']
})
export class HomeResultsPage implements OnChanges {
  @ViewChild('Slides') slides: IonSlides;

  public searchKey = '';
  public yourLocation = '123 Test Street';
  public calender: ICalendar[] = [];
  public segment = '';
  public slideOpts = {
    effect: 'flip',
    zoom: false
  };
  public allData: IMenu;
  public segmentIndex = 0;
  public menu: IMenu;
  public menus: IMenu[] = [];
  public menuSub$: Subscription;
  public cartSub$: Subscription;
  public cart: ICart;
  public filter: IFilter = {
    catId: '',
    maxPrice: 1000000,
    promotion: STATUS_FILTER.all
  };

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController,
    public helperService: HelperService,
    private api: ApiService,
    private router: Router,
    private firebaseService: FirebaseService,
    private cartService: CartService
  ) {
    this.calender = this.helperService.initDate();
    const index = this.calender.findIndex(x => x.isCurrent);
    if (index > -1) {
      this.segmentIndex = index;
      this.segment = this.calender[index].id;
    } else {
      this.segment = this.calender[0].id;
    }
    // this.getListMenu();
    this.getMenu(this.segment);
    this.cart = this.cartService.getCartFromStorage();
    this.cartSub$ = this.cartService.getCart().subscribe((res: ICart) => {
      if (res) {
        this.cart = new Cart(res.products);
        console.log(this.cart);
      }
    });
    console.log(this.firebaseService.getTime())
  }

  ionViewWillEnter() {
    this.menuCtrl.enable(true);
    this.drag(this.segmentIndex);

  }
  settings() {
    this.navCtrl.navigateForward('settings');
  }


  async searchFilter() {
    // const filterParams: IFilter = {
    //   catId: '',
    //   maxPrice: 1000000,
    //   promotion: STATUS_FILTER.all
    // };
    const modal = await this.modalCtrl.create({
      component: SearchFilterPage,
      componentProps: { filterParams: this.filter }
    });
    modal.onDidDismiss().then((res) => {
      console.log(res)
      this.filter = res.data;
    });
    return await modal.present();
  }


  update(i) {
    this.segment = this.calender[i].id;
    this.getMenu(this.segment);
    this.drag(i);
  }

  preventDefault(e) {
    e.preventDefault();
  }
  async change(e) {
    try {
      const index = await this.slides.getActiveIndex();
      this.drag(index);
    } catch (e) {
      console.log(e);
    }

  }

  drag(i) {
    let distanceToScroll = 0;
    for (const index in this.calender) {
      if (parseInt(index, 10) < i) {
        distanceToScroll = distanceToScroll + document.getElementById('seg_' + index).offsetWidth + 24;
      }
    }
    document.getElementById('dag').scrollLeft = distanceToScroll;
  }

  getMenu(date) {
    if (this.menuSub$) {
      this.menuSub$.unsubscribe();
    }
    const id = moment(date).format('DD-MM-YYYY');
    this.helperService.showLoading();
    this.menuSub$ = this.firebaseService.getMenuById(id).subscribe((res) => {
      console.log(res);
      this.menu = res;
      this.allData = Object.assign({}, res);
      this.search();
      this.helperService.hideLoading();

    }, err => {
      this.helperService.hideLoading();
    }, () => {
      this.helperService.hideLoading();
    });
  }

  getListMenu() {
    const start = moment(this.calender[0].id).format('DD-MM-YYYY');
    const end = moment(this.calender[this.calender.length - 1].id).format('DD-MM-YYYY');
    this.menuSub$ = this.firebaseService.getListMenu(start, end).subscribe((res: any) => {
      this.menus = res;
    });

  }
  gotoPage(page) {
    this.router.navigate([page]);
  }

  searchByKey(key) {
    const txt = this.searchKey.toUpperCase();
    if (this.menu[key] && this.allData[key]) {
      this.menu[key] = this.allData[key].filter((p: IProduct) => p.name.toUpperCase().includes(txt))
    }
  }

  search() {
    this.searchByKey('breakfast');
    this.searchByKey('lunch');
    this.searchByKey('drinks');
  }
  ngOnChanges(): void {
    if (this.menuSub$) {
      this.menuSub$.unsubscribe();
    }
    if (this.cartSub$) {
      this.cartSub$.unsubscribe();
    }
  }
}
