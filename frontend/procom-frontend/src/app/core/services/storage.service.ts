import { Injectable } from '@angular/core';
import { AuthValuesModel } from '@app/shared';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  private _getStorage(persist) {
    if (persist) {
      return localStorage;
    } else {
      return sessionStorage;
    }
  }

  save(key: string, value: any, persist = true): void {
    this._getStorage(persist).setItem(key, JSON.stringify(value));
  }

  saveIter(_object: object, persist = true): void {
    // Saves a 0-depth dictionary in Localstorage
    for (let key of Object.keys(_object)) {
      this._getStorage(persist).setItem(key, JSON.stringify(_object[key]));
    }
  }

  getAuthValues(): AuthValuesModel {
    return {
      'token': this.get('token'),
      'refresh_token': this.get('refresh_token'),
      'session_key': this.get('session_key')
    };
  }

  delete(key: string, persist = true): void {
    this._getStorage(persist).removeItem(key);
  }

  get(key: string, persist = true): any {
    const item = this._getStorage(persist).getItem(key);
    if (typeof item === 'string') {
      return JSON.parse(item);
    } else {
      return item;
    }
  }

  deleteAll(persist = true): void {
    // Empties the storage
    this._getStorage(persist).clear();
  }

  getAllKeys(persist = true): string[] {
    // Gets all values from storage
    const keyList: string[] = [];
    for (let key of Object.keys(this._getStorage(persist))) {
      keyList.push(key);
    }
    return keyList;
  }

}
