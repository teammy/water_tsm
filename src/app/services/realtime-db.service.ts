import { Injectable } from '@angular/core';
import { ObjModel, DataModel } from '../models/DataModel';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RealtimeDBService {

  db: AngularFireDatabase
  constructor(db: AngularFireDatabase) {
    this.db = db;
  }

  data: AngularFireList<any>;
  getDataChanges(): Observable<any> {
    this.data = this.db.list<any>('PH');
    return this.data.valueChanges();
  }


}
