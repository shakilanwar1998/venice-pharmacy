import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class EnvService {
  API_URL = 'https://sisdemo.club/venice/public/';

  constructor() { }
}
