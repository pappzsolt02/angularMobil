import { OrderItemModel } from "./order-item.model";

export interface OrderModel {
  id: number;
  userId: number;
  orderItems: OrderItemModel[];
  sumPrice: number;
  postalCode: string;
  city: string;
  address: string;
  orderDate: string;
}
