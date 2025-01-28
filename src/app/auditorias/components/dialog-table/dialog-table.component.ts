import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import {
  MatDialogModule,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { DocumentService } from '../../services';
import { TableComponent } from '../table/table.component';

@Component({
  selector: 'app-dialog-table',
  standalone: true,
  imports: [
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    TableComponent
  ],
  templateUrl: './dialog-table.component.html',
  styleUrl: './dialog-table.component.css'
})
export class DialogTableComponent {
  private documentService = inject( DocumentService );

  public documents = computed( ()=> this.documentService.documents());
  public columns: string[] = ['tipo_oficio','folio','descripcion','archivo'];
}
