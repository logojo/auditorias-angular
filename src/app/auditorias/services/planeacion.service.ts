import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { Planeacion, PlaneacionRequest } from '../interfaces/planeacion.intererface';
import { Stepper } from '../interfaces/auditorias.interface';

@Injectable({
  providedIn: 'root'
})
export class PlaneacionService {
  private url: string =  environments.baseUrl;
  private http = inject( HttpClient );

  public planeacion = signal<Planeacion|undefined>(undefined);
  public stepperFields = signal<Stepper[]|undefined>(undefined);
  public titles = signal<string[]|undefined>(undefined);

  onSave( planeacion : PlaneacionRequest ) : Observable<boolean>  {
    return this.http.post<Planeacion>(`${this.url}/planeaciones`, planeacion )
    .pipe(
     map((res) =>  {
      this.planeacion.set(res)
      return true;
     }),
     catchError( error => {
     return throwError(() => error.error.message )
     })
    )
  }

  getPlaneacion( auditoriaId: string ) {
    this.http.get<Planeacion>(`${this.url}/planeaciones/${auditoriaId}` )         
    .subscribe((res) => {  
          this.planeacion.set( res );  

    })    
  }
}
