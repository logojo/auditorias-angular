import { Injectable, inject, signal } from '@angular/core';
import { environments } from '../../../environments/environments';
import { HttpClient } from '@angular/common/http';

import { Document, InfoDoc } from '../interfaces/Document.interface';
import { Observable, catchError, map, throwError } from 'rxjs';

interface FileResponse {
  secureUrl: string
}


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private url: string =  environments.baseUrl;
  private http = inject( HttpClient );

  getDocument( auditoriaId: string, tipo: string,  step: number, etapa: string ) : Observable<Document> {
    return this.http.post<Document>(`${this.url}/documents/find-one`, {auditoriaId, tipo, step, etapa} )          
  }

  onSaveFile( file: File, infoDoc : InfoDoc ) : Observable<FileResponse> {
    let testData:FormData = new FormData();
    testData.append('file', file, file.name);
    testData.append('dependencia', infoDoc.dependencia);
    testData.append('folio', infoDoc.folio);
    testData.append('tipo', infoDoc.tipo);
    testData.append('step', infoDoc.step);
    testData.append('etapa', infoDoc.etapa);
   
    return this.http.post<FileResponse>(`${this.url}/files/upload`, testData )
      .pipe(  
        map((res) => res ),        
        catchError( error => {
        return throwError(() => error.error.message )
      })
    )
}
}
