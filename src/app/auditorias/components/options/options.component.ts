import { Component, computed, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';

import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuditoriasService } from '../../services/auditorias.service';
import { DialogFormComponent } from '../dialog-form/dialog-form.component';



@Component({
  selector: 'app-options',
  standalone: true,
  imports: [
    MatDialogModule, 
    MatButtonModule, 
    MatIconModule, 
    MatChipsModule, 
    RouterLink
  ],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent {
    private auditoriasService = inject( AuditoriasService );
    private route = inject( Router );

    public auditoria = computed( ()=> this.auditoriasService.auditoria());
    public etapas = ['Planeación', 'Ejecución', 'Seguimiento', 'Informe', 'Conclusión'];

    constructor(
      public dialog: MatDialog,
      private _snackBar: MatSnackBar
    ) {}


    getStatus( etapa : string ) {           
      if( this.auditoria() !== undefined ) {
          if( this.auditoria()!.etapa === etapa && !this.auditoria()!.status  )
              return 'En proceso';
          else if( this.etapas.indexOf( this.auditoria()!.etapa) >  this.etapas.indexOf( etapa ))
              return 'Finalizada';   
          else if( this.auditoria()!.etapa ===  etapa && this.auditoria()!.status )
              return 'Finalizada';                      
          else
              return 'No iniciada';
      }
      return 'No iniciada';
    }

    onNavigate( index: number, id: string ) {  
     const etapa = this.etapas[index]

     console.log(this.etapas[index -1 ]);
     

     if( ( this.etapas.indexOf( this.auditoria()!.etapa ) >  this.etapas.indexOf( etapa )) ||
         (this.auditoria()!.etapa === etapa && this.auditoria()!.status) 
       ) {
           this.notification('Esta etapa ya fue completada', 3000, 'Bien!!!')
           return;
        }

      if( this.getStatus( this.etapas[index -1 ] ) === 'En proceso' && this.etapas[index -1 ] !== undefined || 
          this.getStatus( this.etapas[index -1 ] ) === 'No iniciada' && this.etapas[index -1 ] !== undefined ){           
              this.notification('Complete primero la etapa anterior', 3000, 'Error!!!')
              return; 
          
      }

      localStorage.setItem('url', `${this.getRoute(index)}/${id}`)
      localStorage.setItem('auditoria', JSON.stringify( this.auditoria()))
      this.route.navigate([this.getRoute(index), id])
    }

    getRoute  ( key : number ) {           
      if( key === 0 ){
          return 'auditorias/planeacion';
      }else if( key === 1  )
          return 'auditorias/ejecucion';
      else if( key === 2  )
          return 'auditorias/seguimiento';  
      else if( key === 3  )
          return 'auditorias/informe';              
      else
          return 'auditorias/conclusion';
      
  };

  openDialogForm() {
    this.dialog.open(DialogFormComponent);
  }

  delete(){
    this.auditoriasService.onDelete( this.auditoria()!.id! )
          .subscribe({
            next: () => {
              this.notification('Auditoria eliminada', 3000, 'Bien!!!');
            },
            error:( message ) => {
              this.notification(message, 3000, 'Error!!!');
            }
          })
  }

  public notification( message : string, duration: number, action: string  ) {
    this._snackBar.open(message, action, {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration,
    });
  }

}
