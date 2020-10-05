import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private foodyApi = 'https://gappapi.deliverynow.vn/api/delivery/get_infos';
  constructor(
    public httpClient: HttpClient
  ) { }

  crawlData() {
    const params = {
      restaurant_ids: [87201, 17036, 105260, 123400, 6451, 195959, 714204, 45097, 6452, 111511, 42603, 44367, 198641, 189507]
    };
    return this.httpClient.post(this.foodyApi, params).toPromise();
  }
}
