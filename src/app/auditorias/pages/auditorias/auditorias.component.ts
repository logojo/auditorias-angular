import { Component, computed, inject } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { TableComponent } from '../../components/table/table.component';
import { AuditoriasService } from '../../services/auditorias.service';
import { DialogFormComponent } from '../../components/dialog-form/dialog-form.component';
import { SearchBoxComponent } from '../../components/search-box/search-box.component';


@Component({
  selector: 'app-auditorias',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    SearchBoxComponent,
    TableComponent,
  ],
  templateUrl: './auditorias.component.html',
  styleUrl: './auditorias.component.css'
})
export default class AuditoriasComponent {
   private auditoriasService = inject( AuditoriasService );

   public columns: string[] = ['tipo','folio','representantes','programa','ejercicio','dependencia','etapa','status', 'editar'];
   public auditorias = computed( ()=> this.auditoriasService.auditorias());
   public pagination = computed( ()=> this.auditoriasService.pagination());

   constructor(public dialog: MatDialog) {}

  openDialog() {
    this.auditoriasService.auditoria.set(undefined);
    this.dialog.open(DialogFormComponent);
  }

  handlePageEvent(e: PageEvent) {
    this.auditoriasService.getAuditorias( e.pageIndex + 1,  10)
  }

  searchAuditoria( value : string ) {
    this.auditoriasService.onSearch( 1, value )
  }

}
