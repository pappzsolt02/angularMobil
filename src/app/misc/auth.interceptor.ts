import { HttpEvent, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const authService = inject(AuthService);
  if (authService.loggedinUser) {
    const clonedReq = req.clone({
      setHeaders: {Authorization: authService.loggedinUser.token}
    });
    return next(clonedReq).pipe(
      map( (event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && event.status == 200) {
          authService.updateLoggedInUser( event.headers.get('session') );
        }
        return event;
      })      
    )
  }
  return next(req);
};
