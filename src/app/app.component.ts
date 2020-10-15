import { Component, OnDestroy, OnInit } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Pages } from './interfaces/pages';
import { AuthService } from './services/auth.service';
import { IGoogleUser, IUser } from './interfaces/user.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
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
    public helperService: HelperService
  ) {
    this.appPages = [
      {
        title: 'Trang chủ',
        url: '/home-results',
        icon: 'home'
      },
      {
        title: 'Giới thiệu',
        url: '/about',
        icon: 'information-circle-outline'
      },

      {
        title: 'Cài đặt',
        url: '/settings',
        icon: 'cog'
      }
    ];

    this.initializeApp();
    // this.user = this.authService.getCurrentUser();
    this.userSub$ = this.authService.getUserInfo().subscribe((res: IUser) => {
      this.user = res;
      console.log(this.user)
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
