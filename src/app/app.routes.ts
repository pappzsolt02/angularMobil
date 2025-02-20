import { Routes } from '@angular/router';
import { ProductsComponent } from './components/products/products.component';
import { LoginComponent } from './components/login/login.component';
import { OrdersComponent } from './components/orders/orders.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { authGuard } from './misc/auth.guard';

export const routes: Routes = [
    { path: '', component: ProductsComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'login', component: LoginComponent },
    { path: 'orders', component: OrdersComponent, canActivate:[authGuard] },
    { path: 'admin', component: ProductListComponent, canActivate:[authGuard] }
];        
