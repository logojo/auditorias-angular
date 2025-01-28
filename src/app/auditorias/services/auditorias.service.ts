import { Injectable, computed, inject, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';

import { Auditoria, AuditoriaLocal, AuditoriasResponse, Meta } from '../interfaces/auditorias.interface';
import { Catalogos } from '../interfaces/catalogos.interface';
import { Observable, catchError, map, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AuditoriasService {
  private url: string =  environments.baseUrl;
  private http = inject( HttpClient );

  #auditorias = signal<Auditoria[]>([]); 
  #pagination = signal<Meta|undefined>(undefined); 

  public auditorias = computed( () => this.#auditorias() );
  public pagination = computed( () => this.#pagination() );
  public auditoria = signal<Auditoria|undefined>(undefined)

  constructor( private _snackBar: MatSnackBar ) {
    this.getAuditorias();
 
      if( !this.auditoria() && localStorage.getItem('auditoria') !== null )
         this.auditoria.set( JSON.parse( localStorage.getItem('auditoria') || '' ) );
       
  }

  onStore( auditoria: Auditoria ) : Observable<boolean> {
     return this.http.post<Auditoria>(`${this.url}/auditorias`, auditoria)
             .pipe(
              map((res) => {
                this.#auditorias.update(values => [res, ...values]);
                return true;
              }),
              catchError( error => {
              return throwError(() => error.error.message )
              })
             )
  }

  onUpdate( auditoria: Auditoria, id:string ) : Observable<boolean> {
    return this.http.patch<Auditoria>(`${this.url}/auditorias/${ id }`, auditoria)
            .pipe(
             map((res) => {
              this.#auditorias.update(auditorias => 
                auditorias.map(auditoria => auditoria.id === res.id ?
                  { auditoria, ...res } : auditoria
                )
              );
               return true;
             }),
             catchError( error => {
             return throwError(() => error.error.message )
             })
            )
  }

  onUpdateLocal( auditoria : AuditoriaLocal) {
   if( auditoria.step === 1 ){
    this.#auditorias.update(auditorias => 
      auditorias.map(a => a.id === auditoria.auditoriaId ?
        { 
          ...a, 
          etapa: auditoria.etapa,
          status: auditoria.status  
        } : a
      )
    );
    
  } else if( auditoria.step === auditoria.total){
    this.#auditorias.update(auditorias => 
      auditorias.map(a => a.id === auditoria.auditoriaId ?
        { ...a, 
          etapa: auditoria.etapa, 
          status: auditoria.status 
        } : a
      )
    );
  }
  }

  onDelete(  id:string ) {
    return this.http.delete<Auditoria>(`${this.url}/auditorias/${id}`)
               .pipe(
                map( (res) => {                 
                  this.#auditorias.update(auditorias => auditorias.filter(auditoria =>  auditoria.id !== res.id ))
                }),
                catchError( error => {
                  return throwError(() => error.error.message )
                })
               )
  }

  getAuditorias(page = 1, limit = 10 )  {
       this.http.get<AuditoriasResponse>(`${this.url}/auditorias?page=${page}`)         
          .subscribe(({items, meta}) => {        
                  this.#pagination.set(meta)  
                  this.#auditorias.set(items)               
          })     
  }

  onSearch(page : number = 1, term : string = ' ' )  {
    this.http.post<AuditoriasResponse>(`${this.url}/auditorias/search`, {term} )         
       .subscribe(({items, meta}) => {  
               this.#pagination.set(meta)  
               this.#auditorias.set(items)                
       })     
}

  getCatalogos() : Observable<Catalogos> {
    return this.http.get<Catalogos>(`${this.url}/auditorias/catalogos`)
  }

  setAuditoria( auditoria : Auditoria) {
    this.auditoria.set(auditoria)
  }

  public notification( message : string, duration: number, action: string  ) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration,
    });
  }
}
