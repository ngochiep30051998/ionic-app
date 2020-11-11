import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private api = environment.api;
  constructor(
    public httpClient: HttpClient
  ) { }

  // crawlData() {
  //   const params = {
  //     restaurant_ids: [87201, 17036, 105260, 123400, 6451, 195959, 714204, 45097, 6452, 111511, 42603, 44367, 198641, 189507]
  //   };
  //   return this.httpClient.post(this.api, params).toPromise();
  // }

  checkout(params, idToken) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + idToken);
    headers = headers.set('Content-Type', 'application/json');
    return this.httpClient.post(`${this.api}checkout/create_payment_url`, params, { headers }).toPromise();
  }
}
