import { DataService } from './../../services/data.service';
import { Component } from '@angular/core';
import { ProductModel } from '../../models/product.model';
import { ProductDetailsComponent } from "../product-details/product-details.component";



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductDetailsComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products: ProductModel[] = [];
  productUnderEdit: ProductModel | null = null;

  constructor(private dataService: DataService) { }

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

  newProduct() {
    this.productUnderEdit = {
      id: 0,
      name: '',
      description: '',
      price: 0,
      imageUrl: '',
      imageBase64: '',
    };
  }

  editProduct(product: ProductModel) {
    // this.productUnderEdit = JSON.parse(JSON.stringify(product));
    // this.productUnderEdit = structuredClone(product);
    this.productUnderEdit = {
      ...product
    };
  }


  deleteProduct(product: ProductModel) {

  }

  saved(product: ProductModel) {
    if (this.productUnderEdit!.id) {
      const index = this.products.findIndex(p => p.id == this.productUnderEdit!.id);
      this.products[index] = product;
    } else {
      this.products.push(product);
    }
    this.productUnderEdit = null;
  }
}
