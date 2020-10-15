import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { User } from 'firebase';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { IUser } from '../interfaces/user.interface';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private angularFireAuth: AngularFireAuth
  ) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.angularFireAuth.user.pipe(
      take(1),
      map((user: User) => {
        if (user) {
          this.router.navigate(['/home-results']);
          return false;
        }
        return true;
      })
    );
  }
}
