import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { ProductModel } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { OrderModel } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.configService.apiUrl}/product`);
  }

  newOrder(productId: number): Observable<OrderModel> {
    return this.http.post<OrderModel>(`${this.configService.apiUrl}/order/${productId}`, {});
  }

  getOrders(): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(`${this.configService.apiUrl}/order`);
  }

  save(product: ProductModel): Observable<ProductModel> {
    if (product.id) {
      return this.http.put<ProductModel>(`${this.configService.apiUrl}/product/${product.id}`, product);
    } else {
      return this.http.post<ProductModel>(`${this.configService.apiUrl}/product`, product);
    }
  }
}
