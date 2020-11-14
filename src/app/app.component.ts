import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Pages } from './interfaces/pages';
import { IUser } from './interfaces/user.interface';
import { AuthService } from './services/auth.service';
import { HelperService } from './services/helper.service';



@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  public appPages: Array<Pages>;
  public user: IUser;
  private userSub$: Subscription;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public navCtrl: NavController,
    private authService: AuthService,
    public router: Router,
    public helperService: HelperService,
    public angularFireAuth: AngularFireAuth
  ) {
    this.appPages = [
      {
        title: 'Trang chủ',
        url: '/home-results',
        icon: 'home'
      },

      {
        title: 'Lịch sử mua hàng',
        url: '/order-history',
        icon: 'timer'
      },
      {
        title: 'Giới thiệu',
        url: '/about',
        icon: 'information-circle-outline'
      },

    ];

    this.initializeApp();
    // this.user = this.authService.getCurrentUser();
    // this.userSub$ = this.authService.getUserInfo().subscribe((res: IUser) => {
    //   this.user = res;
    // });

    this.userSub$ = this.angularFireAuth.user.subscribe((res: IUser) => {
      this.user = res;
      console.log(this.user);
    });
  }

  ngOnInit(): void {

  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    }).catch(() => { });
  }

  goToEditProgile() {
    this.router.navigateByUrl('/edit-profile');
  }

  gotoLogin() {
    this.router.navigateByUrl('/login');
  }

  logout() {
    this.authService.logout();
  }

  gotoPage(page) {
    this.router.navigate([page])
  }
  ngOnDestroy(): void {
    if (this.userSub$) {
      this.userSub$.unsubscribe();
    }
  }
}
