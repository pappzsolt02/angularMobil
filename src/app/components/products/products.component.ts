import { Component } from '@angular/core';
import { ProductModel } from '../../models/product.model';
import { DataService } from '../../services/data.service';
import { OrderModel } from '../../models/order.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {

  products: ProductModel[] = [];

  constructor(
    private dataService: DataService,
    private router: Router,
    public authService: AuthService,
    public configService: ConfigService
  ) {}

  ngOnInit() {
    this.dataService.getProducts().subscribe({
      next: (result: ProductModel[]) => {
        this.products = result;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  order(productId: number) {
    this.dataService.newOrder(productId).subscribe({
      next: (result: OrderModel) => {
        this.router.navigate(['orders']);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
