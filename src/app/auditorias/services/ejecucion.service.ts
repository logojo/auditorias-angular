import { Injectable, inject, signal } from '@angular/core';
import { Ejecucion, EjecucionRequest } from '../interfaces/ejecucion.interface';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environments } from '../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class EjecucionService {
  private http = inject( HttpClient );
  private url = environments.baseUrl;

  public ejecucion = signal<Ejecucion|undefined>(undefined);


  onSave( ejecucion : EjecucionRequest ) : Observable<boolean>  {
    return this.http.post<Ejecucion>(`${this.url}/ejecucion`, ejecucion )
    .pipe(
     map((res) =>  {
      this.ejecucion.set(res)
      return true;
     }),
     catchError( error => {
     return throwError(() => error.error.message )
     })
    )
  }

  getEjecucion( auditoriaId: string ) {
    this.http.get<Ejecucion>(`${this.url}/ejecucion/${auditoriaId}` )         
    .subscribe((res) => {  
          this.ejecucion.set( res );    
    })    
  }

  onSkipStep( id: string, step: number ) : Observable<boolean>  {
    return this.http.post<Ejecucion>(`${this.url}/ejecucion/skip-step`, {id, step: step+1 } )
    .pipe(
     map((res) =>  {
      this.ejecucion.set(res)
      return true;
     }),
     catchError( error => {
     return throwError(() => error.error.message )
     })
    )
  }

}
