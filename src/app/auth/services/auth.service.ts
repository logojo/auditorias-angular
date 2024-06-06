import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, throwError, map } from 'rxjs';

import { environments } from '../../../environments/environments';
import { User, AuthStatus, CheckTokenResponse, LoginResponse } from '../interfaces';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseurl : string = environments.baseUrl;
  private readonly http = inject( HttpClient );

  private _currentUser = signal<User|null>(null);
  private _authStatus = signal<AuthStatus>( AuthStatus.ckecking )

  public currentUser = computed( () => this._currentUser() )
  public authStatus = computed( () => this._authStatus() )


  constructor() {
    this.checkAuthStatus().subscribe()
  }

  private setAuthentication( user: User, token : string ) : boolean {
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated)
    localStorage.setItem('token', token);    
    return true;
  }

  onLogin( email: string, password: string ) : Observable<boolean> {
    const url = `${this.baseurl}/auth/login`
    const body =  { email, password }

    return this.http.post<LoginResponse>(url, body)
                    .pipe(
                     map( ({ user, token }) => this.setAuthentication(user, token)),
                     catchError( error => {
                      return throwError(() => error.error.message)
                     }) 
                    )
  }

  checkAuthStatus() : Observable<boolean> {
    const url = `${this.baseurl}/auth/refresh`;
    const token = localStorage.getItem('token')

    if( !token ){
      this.onLogout();
      return of(false);
    }

    return this.http.get<CheckTokenResponse>(url)
               .pipe(
                map(({ user, token }) =>   this.setAuthentication(user, token)),
                catchError( () => {
                  this._authStatus.set( AuthStatus.notAuthenticated )                  
                  return of(false)
                })
               )
  }

  onLogout(){
    localStorage.clear();
    this._currentUser.set( null );
    this._authStatus.set( AuthStatus.notAuthenticated )
  }

}
