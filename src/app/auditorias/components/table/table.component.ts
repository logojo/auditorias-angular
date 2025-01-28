import { Component, Input, ViewChild, effect, input, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatChipsModule} from '@angular/material/chips';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog } from '@angular/material/dialog';

import { OptionsComponent } from '../options/options.component';
import { Auditoria, Meta } from '../../interfaces/auditorias.interface';
import { AuditoriasService } from '../../services/auditorias.service';
import { DocumentService } from '../../services';
import { HttpResponse } from '@angular/common/http';



@Component({
  selector: 'app-table',
  standalone: true,
  imports:[
    CommonModule, 
    MatTableModule, 
    MatSortModule, 
    MatChipsModule, 
    MatButtonModule, 
    MatIconModule, 
    MatTooltipModule,
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css'
})
export class TableComponent<T> {

  private auditoriasService = inject ( AuditoriasService )
  private documentService = inject ( DocumentService )

  @Input()
  placeholder: string = '';

  @Input()
  displayedColumns: string[] = [];

  @Input()
  customPagination: Meta | undefined;

  rows = input<T[]>([]);

  dataSource!: MatTableDataSource<T>;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( public dialog: MatDialog ) {
   
    
    effect(() => {   
      if( this.rows().length > 0 ) {
        this.dataSource = new MatTableDataSource( this.rows() );
        this.dataSource.sort = this.sort;
      }
    })
  }

  openDialog( row: Auditoria ) {
    this.auditoriasService.setAuditoria( row );     
    this.dialog.open(OptionsComponent);
  }

  downloadFile( documento: string ) {

    const data = {
      dependencia: documento.split('/')[6],
      ejercicio: documento.split('/')[7],
      folio: documento.split('/')[8],
      name: documento.split('/')[9]
    }

    this.documentService.downloadFile( data )
    .subscribe( ( doc ) => {
      const file  = new Blob([doc], {type: 'application/pdf'});
      const urlArchivo = window.URL.createObjectURL(file);
      const link = document.createElement('a');
      link.href = urlArchivo;
      link.download = data.name.slice(0,16);
      link.click();
      window.URL.revokeObjectURL(urlArchivo);
    })

    
  }

}




