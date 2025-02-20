import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedinUser: UserModel | null = null;

  constructor(
    private configService: ConfigService,
    private http: HttpClient
  ) { }

  login(model: {email: string, password: string}): Observable<boolean> {
    return this.http.post<UserModel>(`${this.configService.apiUrl}/auth/login`, model).pipe(
      map( (result: UserModel) => {
        this.loggedinUser = result;
        localStorage.setItem('user', JSON.stringify(result));
        return true;
      })
    );
  }

  logout() {
    if (this.loggedinUser && this.loggedinUser.token) {
      //const header = new HttpHeaders().set('Authorization', this.loggedinUser.token);
      this.http.post(`${this.configService.apiUrl}/auth/logout`, {}, /*{headers: header}*/).subscribe();
      this.loggedinUser = null;
      localStorage.removeItem('user');
    }
  }

  checkLogin() {
    var json = localStorage.getItem('user');
    if (!json) {
      return;
    }

    var user: UserModel = JSON.parse(json);
    if (!user || !user.token) {
      return;
    }
    const header = new HttpHeaders().set('Authorization', user.token);
    this.http.get<UserModel>(`${this.configService.apiUrl}/auth`, {headers: header}).subscribe({
      next: (result: UserModel) => {
        this.loggedinUser = result;
        localStorage.setItem('user', JSON.stringify(result));
      }
    });
  }

  updateLoggedInUser(json: string | null) {
    if (json && this.loggedinUser) {
      const data = JSON.parse(json);
      if (data) {
        this.loggedinUser.validTo = data.validTo;
        localStorage.setItem('user', JSON.stringify(this.loggedinUser));
      }
    }
  }
}
