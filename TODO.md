- Bejelentkezés kezelése
    - AuthService
        - objektum: *loggedInUser*
        - új függvény: *login(email: string, password: string): Observable<boolean>*        
        - új függvény: *logout*        
    - login ablak
        - új objektum: *{email: '', password: ''}
        - új változó: *errorMessage*
        - *ngModel*-ek
        - *login()* függvény (html & ts)
    - navbar módosítás
        - public-kal injektálni az AuthService-t
        - *logout()* függvény
        - @if-et rendbe rakni, bejelentkezett felhasználó megjelenítése
    - AuthService
        - *checkLogin* függvény
    - AppComponent
        - *ngOnInit*-ben checklogin

    - AuthGuard bevezetése




