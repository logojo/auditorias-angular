import { Component, computed, inject, signal, effect } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Dependencia, Ejercicio, Programa, Tipo } from '../../interfaces/catalogos.interface';
import { AuditoriasService } from '../../services/auditorias.service';
import { CommonModule } from '@angular/common';
import { requireIf } from '../../validators/validators';

@Component({
  selector: 'app-dialog-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatDialogClose,
    MatDialogModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
  ],
  templateUrl: './dialog-form.component.html',
  styleUrl: './dialog-form.component.css'
})
export class DialogFormComponent {
  
  private auditoriasService = inject( AuditoriasService )
  private fb = inject( FormBuilder );

  public auditoriasForm : FormGroup = this.fb.group({
    tipoAuditoriaId: ['', [ Validators.required ]],
    representantes: [''],
    folio: ['', [ Validators.required ]],
    dependenciaId: ['', [ Validators.required ]], 
    programaId: ['', [ Validators.required ]],
    ejercicioId: ['', [ Validators.required ]],
  },{
    validators: [requireIf('representantes','Conjunta','tipoAuditoriaId')]
  })

  public tipos = signal<Tipo[]>([]);
  public dependencias = signal<Dependencia[]>([]);
  public programas = signal<Programa[]>([]);
  public ejercicios = signal<Ejercicio[]>([]);

  public auditoria = computed( ()=> this.auditoriasService.auditoria());

  private dialogRef = inject (MatDialogRef<DialogFormComponent>)

  


  constructor( private _snackBar: MatSnackBar ) {
    this.auditoriasService.getCatalogos()
                          .subscribe(({ tipos, dependencias, programas, ejercicios}) => {
                            this.tipos.set( tipos )
                            this.dependencias.set( dependencias );
                            this.programas.set( programas )
                            this.ejercicios.set( ejercicios )
                          })  
                          
                          
    effect(() => {
      if( this.auditoria() ) {
        const programa =   this.programas().find(programa => programa.programa === this.auditoria()?.programa )
        const ejercicio =  this.ejercicios().find(ejercicio => ejercicio.ejercicio === this.auditoria()?.ejercicio )
  
        this.auditoriasForm.reset({
          tipoAuditoriaId: this.tipos().find(tipo => tipo.nombre === this.auditoria()?.tipo ),
          representantes: this.auditoria()?.representantes,
          folio: this.auditoria()?.folio,
          dependenciaId: this.dependencias().find(dependencia => dependencia.dependencia === this.auditoria()?.dependencia ),
          programaId: programa?.id,
          ejercicioId: ejercicio?.id
        }) 
      }    
    })
  }


  displayDependencia(dependencia: Dependencia): string {
    return dependencia && dependencia.dependencia ? dependencia.dependencia : '';
  }

  displayTipo(tipo: Tipo): string {
    return tipo && tipo.nombre ? tipo.nombre : '';
  }

  onSave() : void {
    if( this.auditoriasForm.invalid ) {
      this.auditoriasForm.markAllAsTouched();
      return
    }

    const { dependenciaId, tipoAuditoriaId, ...rest } = this.auditoriasForm.value

    if( tipoAuditoriaId.nombre !== 'Conjuntas' )
        delete rest.representantes

      if( this.auditoria() ) {
        this.auditoriasService.onUpdate({ 
             dependenciaId: dependenciaId.id, 
             tipoAuditoriaId: tipoAuditoriaId.id, 
             ...rest 
            }, this.auditoria()!.id!)
            .subscribe({
              next: () => {
                this.notification('Auditoria Modificada', 3000, 'Bien!!!');
                this.dialogRef.close()
                this.auditoriasForm.reset()
              },
              error:( message ) => {
                this.notification(message, 3000, 'Error!!!');
              }
            })
      }
      else {

        this.auditoriasService.onStore({ dependenciaId: dependenciaId.id,  tipoAuditoriaId: tipoAuditoriaId.id,  ...rest })
            .subscribe({
              next: () => {              
                this.notification('Auditoria Agregada', 3000, 'Bien!!!');
                this.dialogRef.close()
                this.auditoriasForm.reset()
              },
              error:( message ) => {
                this.notification(message, 4000, 'Error!!!');
              }
            })
      }
    }

    public notification( message : string, duration: number, action: string  ) {
      this._snackBar.open(message, action, {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration,
      });
    }
}
