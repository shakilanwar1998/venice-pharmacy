import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }

  //public yourSiteUrl = 'http://localhost:8000/api/';
  public yourSiteUrl = 'http://sisdemo.club/venice/public/api/';
  public baseUrl = 'http://sisdemo.club/venice/public/';
  //public baseUrl = 'http://localhost:8000/';

  public user_id = sessionStorage.getItem('app_user_id');
  public pharmacy_name = sessionStorage.getItem('pharmacy_name');
  public pharmacy_id = sessionStorage.getItem('pharmacy_id');
}

export const TOKEN_KEY = 'access_token';
export const STORAGE_KEY = 'userData';
