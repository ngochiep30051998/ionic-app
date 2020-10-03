import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [LoginGuard],
    loadChildren: './pages/login/login.module#LoginPageModule'
  },
  {
    path: 'register',
    canActivate: [LoginGuard],
    loadChildren: './pages/register/register.module#RegisterPageModule'
  },
  {
    path: 'about',
    canActivate: [AuthGuard],
    loadChildren: './pages/about/about.module#AboutPageModule'
  },
  {
    path: 'settings',
    loadChildren: './pages/settings/settings.module#SettingsPageModule'
  },
  {
    path: 'edit-profile',
    canActivate: [AuthGuard],
    loadChildren: './pages/edit-profile/edit-profile.module#EditProfilePageModule'
  },
  {
    path: 'home-results',
    canActivate: [AuthGuard],
    loadChildren: './pages/home-results/home-results.module#HomeResultsPageModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
