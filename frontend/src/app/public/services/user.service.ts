import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { LoginResponse, User } from '../models';
import { catchError, Observable, tap } from 'rxjs';
import { LOCALSTORAGE_KEY_NESTJS_TODO_APP } from '../../app.module';
import { JwtHelperService } from '@auth0/angular-jwt';

export const snackBarConfig: MatSnackBarConfig = {
  duration: 2500,
  horizontalPosition: 'left',
  verticalPosition: 'top',
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = 'api/users';

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private jwtService: JwtHelperService,
  ) {}

  login(user: User): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, user).pipe(
      tap((res: LoginResponse) =>
        localStorage.setItem(
          LOCALSTORAGE_KEY_NESTJS_TODO_APP,
          res.access_token,
        ),
      ),
      tap(() =>
        this.snackBar.open('Login Successful', 'Close', snackBarConfig),
      ),
      catchError((e: any) => {
        this.snackBar.open(`${e.error.message}`, 'Close', snackBarConfig);
        throw e;
      }),
    );
  }

  register(user: User): Observable<User> {
    return this.http.post<User>(this.baseUrl, user).pipe(
      tap((createdUser: User) =>
        this.snackBar.open(
          `User ${createdUser.username} was created`,
          'Close',
          snackBarConfig,
        ),
      ),
      catchError((e: any) => {
        this.snackBar.open(
          `User could not be created because: ${e.error.message}`,
          'Close',
          snackBarConfig,
        );
        throw e;
      }),
    );
  }

  getLoggedInUser() {
    return this.jwtService.decodeToken();
  }
}
