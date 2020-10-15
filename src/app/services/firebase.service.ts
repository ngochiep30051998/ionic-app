import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { HelperService } from './helper.service';
// import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor(
    private db: AngularFireDatabase,
    private helperService: HelperService
  ) { }

  public insertRef(ref: string, value: any) {
    return this.db.list(ref).push(value);
  }

  public insertRefWithId(ref: string, id: string, value: any) {
    return this.db.object(`${ref}/${id}`).set(value);
  }

  getMenuById(id) {
    return this.db.object(`/menus/${id}`).snapshotChanges().pipe(
      map(snap => {
        const ob = this.helperService.snap2Object(snap);
        for (const key in ob) {
          if (ob.hasOwnProperty(key) && key !== 'key') {
            ob[key] = this.helperService.object2ArrMerge(ob[key])
            ob[key] = ob[key].map(p => {
              p.photos = this.helperService.object2Arr(p.photos);
              return p;
            });
          }
        }
        return ob;
      })
    );
  }
}
