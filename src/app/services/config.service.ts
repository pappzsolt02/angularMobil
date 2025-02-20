import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiUrl = 'https://api.mobil-webshop.jedlik.cloud/api';
  
  constructor() { }
}
