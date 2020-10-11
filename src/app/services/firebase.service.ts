import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  constructor() { }

  public insertRef(ref: string, value: any) {
    return firebase.database().ref(ref).push(value);
  }

  public insertRefWithId(ref: string, id: string, value: any) {
    return firebase.database().ref(`${ref}/${id}`).set(value);
  }
}
