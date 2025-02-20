import { DataService } from './../../services/data.service';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductModel } from '../../models/product.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  @Input() product: ProductModel | undefined;
  @Output() canceled = new EventEmitter<void>();
  @Output() saved = new EventEmitter<ProductModel>();
  errorMessage = '';

  constructor(private dataService: DataService) { }

  save() {
    if (this.checkRequireValues()) {
      this.dataService.save(this.product!).subscribe({
        next: (product: ProductModel) => {
          this.saved.emit(product);
        },
        error: (err: any) => {
          this.errorMessage = err.error?.message ?? err.message;
          console.log(err);
        }
      });
    }
  }

  checkRequireValues(): boolean {
    this.errorMessage = '';
    if (!this.product) {
      return false;
    }
    if (!this.product.name) {
      this.errorMessage += 'Kérem adja meg a termék nevét! ';
    }
    if (!this.product.description) {
      this.errorMessage += 'Kérem adja meg a termék leírását! ';
    }
    if (this.product.price <= 0) {
      this.errorMessage += 'Kérem adja meg a termék árát! ';
    }
    // if (!this.product.imageBase64) {
    //   this.errorMessage += 'Kérem adja meg a termék kép URL-jét! ';
    // }
    return !this.errorMessage;
  }

  imageChanged(event: any) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length > 0) {
      const file = input.files![0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.product!.imageBase64 = reader.result?.toString().split(',')[1];
      };
    }
  }
}
