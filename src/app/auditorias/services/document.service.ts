import { Injectable, inject, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { Document, InfoDoc } from '../interfaces/Document.interface';
import { Observable, catchError, map, throwError } from 'rxjs';

interface FileResponse {
  secureUrl: string
}

interface UrlData {
  dependencia: string;
  ejercicio: string;
  folio: string;
  name: string;
}


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private url: string =  environments.baseUrl;
  private http = inject( HttpClient );

  public documents = signal<Document[]|undefined>(undefined)

  getDocument( auditoriaId: string, tipo: string,  step: number, etapa: string ) : Observable<Document> {
    return this.http.post<Document>(`${this.url}/documents/find-one`, {auditoriaId, tipo, step, etapa} )          
  }

  
  getDocuments( auditoriaId: string,  step: number, etapa: string ) : Observable<boolean> {
    return this.http.post<Document[]>(`${this.url}/documents`, {auditoriaId, step, etapa} ) 
    .pipe(  
      map((res) => {
        this.documents.set(res)
        return true
      }),        
      catchError( error => {
      return throwError(() => error.error.message )
    })
    )         
  }

  onSaveFile( file: File, infoDoc : InfoDoc, several?: boolean) : Observable<FileResponse> { 
    let formData:FormData = new FormData();
    
    
    
    formData.append('dependencia', infoDoc.dependencia);
    formData.append('folio', infoDoc.folio);
    formData.append('tipo', infoDoc.tipo);
    formData.append('step', infoDoc.step);
    formData.append('etapa', infoDoc.etapa);
    formData.append('file', file, file.name);

    console.log(formData);
    
    if( several )
        formData.append('several', JSON.stringify(several));
   
    return this.http.post<FileResponse>(`${this.url}/files/upload`, formData )
      .pipe(  
        map((res) => res ),        
        catchError( error => {
        return throwError(() => error.error.message )
      })
    )
  }
  
  downloadFile( data : UrlData  ) : Observable<Blob> {
      return this.http.post<Blob>(`${this.url}/files/download`, data, { responseType: 'blob' as 'json'}) 
  }
}
