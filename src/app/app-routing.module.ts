import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { LoginGuard } from './guards/login.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate:[LoginGuard],
    loadChildren: './pages/login/login.module#LoginPageModule'
  },
  {
    path: 'register',

    loadChildren: './pages/register/register.module#RegisterPageModule'
  },
  {
    path: 'about',

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

    loadChildren: './pages/home-results/home-results.module#HomeResultsPageModule'
  },
  {
    path: 'product-detail/:menuId/:meal/:id',
    loadChildren: './pages/product-detail/product-detail.module#ProductDetailPageModule'
  },
  { path: 'cart', loadChildren: './pages/cart/cart.module#CartPageModule' },
  { path: 'order-history', loadChildren: './pages/order-history/order-history.module#OrderHistoryPageModule' },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'home-results'
  },
  { path: 'favorite', loadChildren: './pages/favorite/favorite.module#FavoritePageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
