# MobilWebshop

Projekt létrehozása
```bash
ng new mobil-webshop --skip-tests
```

## A kiinduló állomány létrehozásához szükséges lépések:
1. **app.config.ts** módosítása
   
   A Http kliens engedélyezése 

   ```ts
   import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
   import { provideRouter } from '@angular/router';
   
   import { routes } from './app.routes';
   import { provideHttpClient, withFetch } from '@angular/common/http';
   
   export const appConfig: ApplicationConfig = {
     providers: [
       provideZoneChangeDetection({ eventCoalescing: true }), 
       provideRouter(routes),
       provideHttpClient(withFetch())
     ]
   };
   ```
2. Könyvtárak létrehozása
   - *components*: ide bemásoltam az app.component.* fájlokat (módosítani kell *main.ts* állományban az importot)
   - *services*  
     - ConfigService: nincs más szerepe, csak az API URL tárolása
     - AuthService: ide kerül minden, ami a jogosultság kezelésével kapcsolatos
     - DataService: termékekkel, rendelésekkel kapcsolatos http hívások függvényei

     ```bash
     ng generate service config
     ng generate service auth
     ng generate service data
     ```

     **config.service.ts** tartalma:
     ```ts
     import { Injectable } from '@angular/core';

     @Injectable({
       providedIn: 'root'
     })
     export class ConfigService {
     
       apiUrl = 'https://api.mobil-webshop.jedlik.cloud/api';
       
       constructor() { }
     }
     ```
   - *misc*: guard-nak, és egyéb típusoknak, amiből most csak 1-1 darab lesz
   - *models*
     
     **user.model.ts**
     ```ts
     export interface UserModel {
       name: string
       validTo: Date;
       email: string
       roles: string[]
       token: string
     }
     ```

     **product.model.ts**
     ```ts
     export interface ProductModel {
       id: number;
       name: string;
       description: string;
       price: number;
       imageUrl: string;
       imageBase64: string | undefined;
     }
     ```

     **order-item.model.ts**
     ```ts
     export interface OrderItemModel {
       id: number;
       orderId: number;
       productId: number;
       quantity: number;
       sumPrice: number;
       productName: string;
     }     
     ```

     **order.model.ts**
     ```ts
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
     ```

3. Komponensek létrehozása
    - **Navbar**
      
      ```bash
      ng generate component Navbar
      ```

      A HTML és css kódok bemásolása a mintából...
      
      *navbar.component.html*
      ```html
      <nav class="navbar">
        <div class="menu">
			<h3>Mobil webshop</h3>
            <a href="#" class="selected">Termékek</a>
            <a href="#">Megrendelések</a>
            <a href="#">Admin</a>
        </div>
        <a href="#">Login</a>
		<div class="user-menu" onclick="toggleDropdown()">
			<a> Béla</a>
            <div class="dropdown" id="dropdownMenu">
                <a href="#" onclick="logout()">Kijelentkezés</a>
            </div>
        </div>
      </nav>
      ```
      *navbar.component.css*
      ```css
        .navbar {
            font-family: Arial, sans-serif;
            background-color: #007bff;
            padding: 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .navbar a {
            color: white;
            text-decoration: none;
            padding: 10px 15px;
            font-size: 18px;
        }
		.navbar h3 {
		    color: white;
            text-decoration: none;
            padding: 7px 15px;
			margin: 0 12px 0 0;
            font-size: 24px;
		}
        .navbar a:hover {
            background-color: #0056b3;
            border-radius: 4px;
        }
        .menu {
            display: flex;
        }
		.navbar a.selected {
			color: yellow;
			font-weight: bold;
		}
		.dropdown {
			display: none;
			position: absolute;
            right: 0;
            top: 50px;
            background: white;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
            min-width: 150px;
            overflow: hidden;
		}
		.user-menu:hover .dropdown {
            display: block;
            
        }
        .dropdown a {
            display: block;
            padding: 10px;
            text-decoration: none;
            color: black;
        }
        .dropdown a:hover {
            background: #0056b3;
			color: white;
        }
      ```

    - **Termékek (nyitó) oldal**

      ```bash
      ng generate component products
      ```

      A HTML és css kódok bemásolása a mintából...

      *products.component.html*
      ```html
      <div class="container">
        <div class="card">
            <h3>iPhone 15 Pro Max</h3>
            <img src="https://api.mobil-webshop.jedlik.cloud/api/Product/image/1">
            <p>Az iPhone 15 Pro Max az Apple legújabb csúcskategóriás okostelefonja, amely lenyűgöző 6,7 hüvelykes Super Retina XDR kijelzővel, A17 Bionic chippel és továbbfejlesztett háromlencsés kamerarendszerrel rendelkezik. A készülék támogatja az 5G hálózatokat, és akár 1 TB tárhellyel is elérhető.</p>
            <div class="price">599 999 Ft</div>
			<button class="cart-btn">Megrendelés</button>
        </div>
        <div class="card">
            <h3>Samsung Galaxy S23 Ultra</h3>
            <img src="https://api.mobil-webshop.jedlik.cloud/api/Product/image/2">
            <p>A Samsung Galaxy S23 Ultra a dél-koreai gyártó legújabb prémium okostelefonja, amely 6,8 hüvelykes Dynamic AMOLED 2X kijelzővel, Exynos 2200 vagy Snapdragon 8 Gen 2 processzorral és akár 12 GB RAM-mal érkezik. A készülék hátlapján négykamerás rendszer található, beleértve egy 108 MP-es főkamerát, egy periszkópos teleobjektívet és ultraszéles látószögű lencsét.</p>
            <div class="price">549 999 Ft</div>
			<button class="cart-btn">Megrendelés</button>
        </div>
        <div class="card">
            <h3>Google Pixel 8 Pro</h3>
            <img src="https://api.mobil-webshop.jedlik.cloud/api/Product/image/3">
            <p>A Google Pixel 8 Pro a keresőóriás legújabb okostelefonja, amely 6,7 hüvelykes OLED kijelzővel, Google Tensor G3 processzorral és 12 GB RAM-mal rendelkezik. A készülék kiemelkedő kameraképességeiről ismert, beleértve a továbbfejlesztett éjszakai módot és a mesterséges intelligenciával támogatott fotózási funkciókat.</p>
            <div class="price">499 999 Ft</div>
			<button class="cart-btn">Megrendelés</button>
        </div>        
      </div>      
      ```

      *products.component.css*
      ```css
      .container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            width: 100%;
            display: flex;
            justify-content: center;
			margin: 8px auto;
			flex-wrap: wrap;
        }
        .card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            text-align: center;
            padding: 15px;
			width: 300px;
        }
        .card img {
            width: 100%;
            height: 180px;
            object-fit: contain;
            border-radius: 8px 8px 0 0;
			margin: 12px;
        }
        .card h3 {
            margin: 10px 0;
            font-size: 18px;
        }
        .card p {
            font-size: 14px;
            color: #555;
            margin: 12px;
			text-align: justify;
        }
        .price {
            font-size: 16px;
            font-weight: bold;
            color: #007bff;
            margin: 10px 0;
        }
		.cart-btn {
            background-color: #28a745;
            color: white;
            border: none;
            padding: 10px;
            width: 75%;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;			
        }
        .cart-btn:hover {
            background-color: #218838;
        }
		.cart-btn:disabled {
			background-color: #777;
			cursor: not-allowed;
			color: #333;
		}
      ```

    - **Korábbi megrendelések listája**

      ```bash
      ng generate component orders
      ```

      A HTML és css kódok bemásolása a mintából...

      *orders.component.html*
      ```html
      <div class="order-container">
        <div class="order">
            <div class="order-header" onclick="toggleOrder(this)">
				<span>#106</span>
                <span>2024-02-01</span>
                <span>18 500 Ft</span>
            </div>
            <div class="order-details">
                <ul>
                    <li><span>Termék 1</span> <span>5000</span></li>
                    <li><span>Termék 2</span> <span>7500</span></li>
                    <li><span>Termék 3</span> <span>4000</span></li>
                </ul>
            </div>
        </div>

        <div class="order">
            <div class="order-header" onclick="toggleOrder(this)">
                <span>#67</span>
				<span>2024-01-28</span>
                <span>10 200 Ft</span>
            </div>
            <div class="order-details">
                <ul>
                    <li><span>Termék 4</span> <span>3200</span></li>
                    <li><span>Termék 5</span> <span>7000</span></li>
                </ul>
            </div>
        </div>

        <div class="order">
            <div class="order-header" onclick="toggleOrder(this)">
				<span>#12</span>
                <span>2024-01-15</span>
                <span>25 000 Ft</span>
            </div>
            <div class="order-details">
                <ul>
                    <li><span>Termék 6</span> <span>12000</span></li>
                    <li><span>Termék 7</span> <span>8000</span></li>
                    <li><span>Termék 8</span> <span>5000</span></li>
                </ul>
            </div>
        </div>
      </div>
      ```

      *orders.component.css*
      ```css
      .order-container {
            max-width: 600px;
            margin: 20px auto;
        }
        .order {
            background: white;
            margin-bottom: 10px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .order-header {
            background: #007bff;
            color: white;
            padding: 10px 15px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 16px;
        }
        .order-header:hover {
            background: #0056b3;
        }
        .order-details {
            display: none;
            background: white;
            padding: 10px;
            border-top: 1px solid #ddd;
        }
        .order-details ul {
            list-style: none;
            padding: 0;
        }
        .order-details li {
            padding: 5px 0;
            border-bottom: 1px solid #ddd;
            display: flex;
            justify-content: space-between;
        }
      ```

    - **Termékek listája (admin) oldal**

      ```bash
      ng generate component ProductList
      ```

      A HTML és css kódok bemásolása a mintából...

      *product-list.component.html*
      ```html
      <h2>Terméklista</h2>	
      <table>
        <thead>
            <tr>
                <th>
					<button class="new">Új termék</button>
				</th>
                <th>Termék neve</th>
                <th>Ár (Ft)</th>
            </tr>
        </thead>
        <tbody id="productTable">
            <tr>
                <td>
                    <span class="icon edit">✏️</span>
                    <span class="icon delete">🗑️</span>
                </td>
                <td>iPhone 15 Pro Max</td>
                <td>599 999 Ft</td>
            </tr>
            <tr>
                <td>
                    <span class="icon edit">✏️</span>
                    <span class="icon delete">🗑️</span>
                </td>
                <td>Samsung Galaxy S23 Ultra</td>
                <td>549 999 Ft</td>
            </tr>
        </tbody>
      </table>
      ```

      *product-list.component.css*
      ```css
      h2 {
			text-align: center;
	  }
      table {
            width: 60%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
			margin: 12px auto;
	  }
	  th, td {
            padding: 10px;
            border: 1px solid #ddd;
            text-align: center;
	  }
	  th {
            background: #007bff;
            color: white;
	  }
	  .icon {
            cursor: pointer;
            margin: 0 5px;
	  }
	  th:nth-of-type(1){
			width: 80px;
		}
	  th:nth-of-type(3){
			width: 150px;
	  }
	  button.new {
			padding: 2px 8px;			
			background-color: #28a745;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;			
	  }
      ```

    - **Termék rögzítése, módosítása (admin) oldal**

      ```bash
      ng generate component ProductDetails
      ```

      A HTML és css kódok bemásolása a mintából...

      *product-details.component.html*
      ```html
      <div class="background">

      </div>    
      <div class="container">
        <div class="form-container">
			<div class="close-btn">X</div>
			<h2>Termék hozzáadása</h2>
            <form id="productForm">
                <input type="text" id="productName" placeholder="Termék neve" required>
                <textarea id="productDescription" placeholder="Leírás" rows="4" required></textarea>
                <input type="number" id="productPrice" placeholder="Ár (Ft)" required>
                <input type="file" id="productImage" accept="image/*">
                <button type="submit">Hozzáadás</button>
				<div class="error">Hiba a mentés során: ...</div>
            </form>
			
        </div>
      </div>
      ```

      *product-details.component.css*
      ```css
      .container {
            position: absolute;
            top: 40px;
            left: 0;
            z-index: 1;
            width: 100%;
      }
      .form-container {
            background: white;
            padding: 20px;
            border-radius: 8px;
            width: 600px;
            text-align: center;
			margin: 12px auto;                                   
      }
      input, textarea {
            width: 560px;
            padding: 10px;
            margin: 8px 0;
            border: 1px solid #ccc;
            border-radius: 4px;
      }
      button {
            width: 580px;
            padding: 10px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
			margin: 12px 0;
      }
      button:hover {
            background-color: #0056b3;
      }
      .background {
            width: 100%;
            height: 100vh;
            overflow: hidden;
            position: absolute;
            left: 0;
            top: 0;
            background-color: black;
            opacity: 0.5;
            z-index: 0;
      }	
      div.close-btn {
			margin-top: -12px;
			margin-bottom: -30px;
			text-align: right;
			color: #777;
			font-family: arial;
			cursor: pointer;
      }
      div.error {
			color: #f00
      }
      ```

    - **Login ablak**

      ```bash
      ng generate component login
      ```

      A HTML és css kódok bemásolása a mintából...

      *login.component.html*
      ```html
      <div class="container">
		<div class="login-container">
			<h2>Bejelentkezés</h2>
			<input type="email" id="email" placeholder="Email">
			<input type="password" id="password" placeholder="Jelszó">
			<button onclick="login()">Belépés</button>
			<div class="error-message" id="error-msg"></div>
		</div>
	  </div>
      ```

      *login.component.css*
      ```css
      .container {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 80px;
      }
      .login-container {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
          width: 300px;
          text-align: center;
      }
      input {
          width: calc(100% - 20px);
          padding: 10px;
          margin: 8px 0;
          border: 1px solid #ccc;
          border-radius: 4px;
      }
      .error-message {
          color: red;
          font-size: 14px;
          height: 20px;
          margin-bottom: 10px;
      }
      button {
          width: calc(100% - 0px);
          padding: 10px;
          background-color: #28a745;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
	      margin: 8px 0;
      }
      button:hover {
          background-color: #218838;
      }
      ```



4. Routing beállítása
    - **app.routes.ts** fájl módosítása

      ```ts 
      import { Routes } from '@angular/router';
      import { ProductsComponent } from './components/products/products.component';
      import { LoginComponent } from './components/login/login.component';
      import { OrdersComponent } from './components/orders/orders.component';
      import { ProductListComponent } from './components/product-list/product-list.component';
  
      export const routes: Routes = [
          { path: '', component: ProductsComponent },
          { path: 'products', component: ProductsComponent },
          { path: 'login', component: LoginComponent },
          { path: 'orders', component: OrdersComponent },
          { path: 'admin', component: ProductListComponent }
      ];         
      ```
    
    - **app.component.html** módosítása

      ```html
      <app-navbar></app-navbar>

      <router-outlet></router-outlet>
      ```

    - **navbar.compoment.ts** módosítása

      ```ts
      import { Component } from '@angular/core';
      import { RouterLink } from '@angular/router';
      
      @Component({
        selector: 'app-navbar',
        standalone: true,
        imports: [RouterModule],   //A RouterModule-t importálni kell!!!
        templateUrl: './navbar.component.html',
        styleUrl: './navbar.component.css'
      })      
      export class NavbarComponent {
      
      }      
      ```

    - **navbar.compoment.html** módosítása

      ```html
      <nav class="navbar">
          <div class="menu">
              <h3>Mobil webshop</h3>
              <a routerLink="products" routerLinkActive="selected">Termékek</a>
              <a routerLink="orders" routerLinkActive="selected">Megrendelések</a>
              <a routerLink="admin" routerLinkActive="selected">Admin</a>
          </div>
          @if (true) { <!-- is NOT looged int  -->
              <a routerLink="login" routerLinkActive="selected">Login</a>
          } @else 
          {
              <div class="user-menu" onclick="toggleDropdown()">
                  <a> Béla</a>
                  <div class="dropdown" id="dropdownMenu">
                      <a href="#" onclick="logout()">Kijelentkezés</a>
                  </div>
              </div>
          }
      </nav>
      ```

    