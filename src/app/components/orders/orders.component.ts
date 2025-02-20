import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { OrderModel } from '../../models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent {

  orders: OrderModel[] = [];
  openedOrderId = 0;

  constructor (private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getOrders().subscribe({
      next: (result: OrderModel[]) => {
        this.orders = result;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
