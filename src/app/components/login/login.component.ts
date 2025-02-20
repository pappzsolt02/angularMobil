import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  model = {
    email: 'admin@my-webshop.com', 
    password: 'Admin'
  };
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {
    this.errorMessage = '';
    if (!this.model.email || !this.model.password) {
      this.errorMessage = 'Kérem adja meg az adatokat!';
    } else {
      this.authService.login(this.model).subscribe({
        next: (successfull: boolean) => {
          if (!successfull) {
            this.errorMessage = 'Váratlan hiba...';
          } else 
          if (this.authService.loggedinUser?.roles.includes('admin')) {
              this.router.navigate(['admin'])
          } else 
          if (this.authService.loggedinUser?.roles.includes('user')) {
            this.router.navigate(['orders'])
          } else {
            this.router.navigate(['products'])
          }
        },
        error: (err: any) => {
          console.log(err);
          this.errorMessage = err.error?.message ?? err.message;
        }
      })
    }
  }
}
