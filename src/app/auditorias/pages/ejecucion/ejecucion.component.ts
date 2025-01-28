import { Component, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';

import { switchMap } from 'rxjs';
import moment from 'moment';

import { AuditoriasService, DocumentService, EjecucionService } from '../../services';
import { StteperComponent } from '../../components/stteper/stteper.component';
import { ConfirmComponent } from '../../components/confirm/confirm.component';
import { DialogTableComponent } from '../../components/dialog-table/dialog-table.component';

import { Etapa, Field, Stepper, TipoAuditoria } from '../../interfaces/auditorias.interface';
import { InfoDoc, Oficio } from '../../interfaces/Document.interface';
import { EjecucionRequest } from '../../interfaces/ejecucion.interface';


@Component({
  selector: 'app-ejecucion',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, 
    MatIconModule,
    MatButtonModule, 
    MatTooltipModule,
    StteperComponent
  ],
  templateUrl: './ejecucion.component.html',
  styleUrl: './ejecucion.component.css'
})
export default class EjecucionComponent {
  private auditoriasService = inject( AuditoriasService );
  private documentService = inject( DocumentService );
  private ejecucionService = inject( EjecucionService);
  private router = inject( Router )
  public dialog = inject( MatDialog ) 

  public auditoria = computed( ()=> this.auditoriasService.auditoria());
  public ejecucion = computed( ()=> this.ejecucionService.ejecucion());

  public several =  signal<boolean>(false) 
  public step = signal<number|undefined>(undefined)
  public selected = signal<number|undefined>(undefined)

  public titles: string[] = [];

  public docs: boolean = false;


  @ViewChild(StteperComponent) stepper! : StteperComponent;

  public stepperFields : Stepper[] = []

  constructor() {    
    effect(()=> {
      if( this.auditoria() ) {
          this.onGetStepper( this.auditoria()!.tipo )
          this.ejecucionService.getEjecucion( this.auditoria()!.id! )
          //if( !this.several() )        
              this.step.set(this.ejecucion()?.step)
      }
    }, { allowSignalWrites: true })
  }

  onGetStepper( tipo : TipoAuditoria) {
    if( tipo === TipoAuditoria.Directa || tipo === TipoAuditoria.Evaluacion ) {
         this.stepperFields = [
          {
            id: "paso 1", 
            fields : [ 
              { 
                type: 'select',
                name: 'prorroga', 
                label:  '¿Existe Solicitud de prórroga?',
                value: '',
                required: true, 
                live: true,
                rule: ['1'],
                inputs: ['folio','fecha_inicio','file'],
                options: [           
                    {value: '1', label: 'Sí' },
                    {value: '0', label: 'No' },
                ]
              },
              { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: false, ruleable: true},
              { type: 'date', name: 'fecha_inicio',  label: 'Fecha de Inicio', value: '', required: false, ruleable: true},
              { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: false, ruleable: true}
            ]
          },
          {
            id: "paso 2", 
            fields : [
              { 
                type: 'select',
                name: 'prorroga', 
                label:  '¿Existe Solicitud de prórroga?',
                value: '',
                required: true, 
                live: true,
                rule: ['1'],
                inputs: ['folio','fecha_inicio','file'],
                options: [           
                    {value: '1', label: 'Sí' },
                    {value: '0', label: 'No' },
                ]
              },
              { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: false, ruleable: true},
              { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: false, ruleable: true},
              { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: false, ruleable: true}
            ]
          },
          {
            id: "paso 3", 
            fields : [
              {
                type: 'select',
                name: 'tipo_oficio', 
                label:  'Oficios',
                value: '',
                required: true, 
                options: [           
                    {value: Oficio.A, label: Oficio.A },
                    {value: Oficio.A, label: Oficio.B },
                    {value: Oficio.C, label: Oficio.C },
                ]
              },
              { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
              { type: 'text', name: 'descripcion', label: 'Breve descripción del oficio', value: '', required: true},
              { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
              { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: true}
            ]
          },
          {
            id: "paso 4", 
            fields : [
              {
                type: 'select',
                name: 'tipo_oficio', 
                label:  'Oficios',
                value: '',
                required: true, 
                options: [           
                    {value: Oficio.A, label: Oficio.A },
                    {value: Oficio.A, label: Oficio.B },
                    {value: Oficio.C, label: Oficio.C },
                ]
              },
              { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
              { type: 'text', name: 'descripcion', label: 'Breve descripción del oficio', value: '', required: true},
              { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
              { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: true}
            ]
          }
         ];

         this.titles =  [
          'Oficio de Solicitud de Prórroga',
          'Oficio de Autorizacion de Prórroga',
          'Oficios de Entrega de documentación para la atención de requerimientos emitido a la dependencia o Entidad fiscalizada',
          'Oficios Complementarios',
         ];
    }
    else if( tipo === TipoAuditoria.Conjunta ) { 
      this.stepperFields = [
        {
          id: "paso 1", 
          fields : [ 
            { 
              type: 'select',
              name: 'prorroga', 
              label:  '¿Existe Solicitud de prórroga?',
              value: '',
              required: true, 
              live: true,
              rule: ['1'],
              inputs: ['folio','fecha_inicio','file'],
              options: [           
                  {value: '1', label: 'Sí' },
                  {value: '0', label: 'No' },
              ]
            },
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: false, ruleable: true},
            { type: 'date', name: 'fecha_inicio',  label: 'Fecha de Inicio', value: '', required: false, ruleable: true},
            { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: false, ruleable: true}
          ]
        },
        {
          id: "paso 2", 
          fields : [
            { 
              type: 'select',
              name: 'prorroga', 
              label:  '¿Existe Solicitud de prórroga?',
              value: '',
              required: true, 
              live: true,
              rule: ['1'],
              inputs: ['folio','fecha_inicio','file'],
              options: [           
                  {value: '1', label: 'Sí' },
                  {value: '0', label: 'No' },
              ]
            },
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: false, ruleable: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: false, ruleable: true},
            { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: false, ruleable: true}
          ]
        },
        {
          id: "paso 3", 
          fields : [
            {
              type: 'select',
              name: 'tipo_oficio', 
              label:  'Oficios',
              value: '',
              required: true, 
              options: [           
                  {value: Oficio.A, label: Oficio.A },
                  {value: Oficio.A, label: Oficio.B },
                  {value: Oficio.C, label: Oficio.C },
              ]
            },
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'text', name: 'descripcion', label: 'Breve descripción del oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
            { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: true}
          ]
        },
        {
          id: "paso 4", 
          fields : [
            {
              type: 'select',
              name: 'tipo_oficio', 
              label:  'Oficios',
              value: '',
              required: true, 
              options: [           
                  {value: Oficio.A, label: Oficio.A },
                  {value: Oficio.A, label: Oficio.B },
                  {value: Oficio.C, label: Oficio.C },
              ]
            },
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'text', name: 'descripcion', label: 'Breve descripción del oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
            { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: true}
          ]
        },
        {
          id: "paso 5", 
          fields : [
            {
              type: 'select',
              name: 'tipo_oficio', 
              label:  'Oficios',
              value: '',
              required: true, 
              options: [           
                  {value: Oficio.A, label: Oficio.A },
                  {value: Oficio.A, label: Oficio.B },
                  {value: Oficio.C, label: Oficio.C },
              ]
            },
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'text', name: 'descripcion', label: 'Breve descripción del oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
            { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: true}
          ]
        },
        {
          id: "paso 6", 
          fields : [
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'text', name: 'descripcion', label: 'Breve descripción del oficio', value: '', required: true},
            { 
              type: 'select',
              name: 'sin_cuantificar', 
              label:  'Sin cuantificar',
              value: '',
              required: true, 
              live: true,
              rule: ['1'],
              inputs: ['monto-5'],
              options: [           
                  {value: '1', label: 'Sí' },
                  {value: '0', label: 'No' },
              ]
            },
            { type: 'number', name: 'monto', label: 'Monto observado', value: '', required: false, ruleable: true},
            { type: 'text', name: 'correctiva', label: 'Medida correctiva', value: '', required: true},
            { type: 'text', name: 'desc_medida', label: 'Descripción breve de la medida', value: '', required: true},
            { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: true}
          ]
        },
        {
          id: "paso 7",
          fields:[
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'text', name: 'descripcion', label: 'Breve descripción del oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
            { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: true}
          ]
        },
        {
          id: "paso 8",
          fields:[
            { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
            { type: 'date', name: 'fecha_termino', label: 'Fecha de Inicio', value: '', required: true},
            { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: true}
          ]
        },
        {
          id: "paso 9",
          fields:[
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'text', name: 'descripcion', label: 'Breve descripción del oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
            { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: true}
          ]
        },
        {
          id: "paso 10",
          fields:[
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'text', name: 'descripcion', label: 'Breve descripción del oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
            { type: 'date', name: 'fecha_termino', label: 'Fecha limite', value: '', required: true},
            { type: 'file', name: 'file', label:'Subir Archivo', value: '', required: true}
          ]
        },
        {
          id: "paso 11",
          fields:[]
        }
      ]

      this.titles = [
        'Oficio de Solicitud de Prórroga',
        'Oficio de Autorizacion de Prórroga',
        'Oficios de Entrega de documentación para la atención de requerimientos emitido a la dependencia o Entidad fiscalizada',
        'Oficios de Envío de documentación en atención a los requerimientos emitido a la dependencia o Entidad fiscalizada',
        'Oficios Complementarios',
        'Resultados Preliminares',
        'Oficios de citación para notificación de resultados preliminares emitido a las Dependencias y Entidades fiscalizadas',
        'Acta Administrativa de Resultados Preliminares',
        'Oficios de envío del acta de resultados preliminares emitido a las Dependencias y Entidades fiscalizadas',
        'Oficios de entrega de documentación para la atención a los resultados preliminares emitido por la Dependencia o Entidad fiscalizada',
        'Oficios de envío de documentación en atención a los resultados preliminares emitido por la Dependencia o Entidades fiscalizadas',
        'Análisis Resultados Preliminares' //Todo:: todos estos se capturaran en la tabla resultados en el campo preliminares
      ];
    }
  }

  onSave( ejecucion: EjecucionRequest ) {
    const infoDoc : InfoDoc = {
      dependencia: this.auditoria()!.siglas,
      folio: this.auditoria()!.folio,
      tipo: this.auditoria()!.tipo,
      step: ''+ejecucion.step,
      etapa: Etapa.Ejecución
    }

    this.documentService.onSaveFile( ejecucion.file!, infoDoc, this.several() )
    .pipe(
      switchMap( (res) => {
        delete ejecucion.file
        let eje : EjecucionRequest = { 
          ...ejecucion, 
          archivo: 
          res.secureUrl, 
          auditoriaId: 
          this.auditoria()!.id!, 
          total: this.stepperFields.length,  
          several: this.several()
        }
        return this.ejecucionService.onSave( eje )
      })
    )
     .subscribe({
       next: () => {    
        this.auditoriasService.notification('Paso completado', 3000, 'Bien!!!');
        if( ejecucion.step === this.stepperFields.length ) {
          this.auditoriasService.onUpdateLocal({
            auditoriaId: this.auditoria()!.id!,
            etapa: Etapa.Ejecución,
            status: true,
            step: ejecucion.step,
            total: this.stepperFields.length           
          })
          localStorage.setItem('url', '/auditorias/auditorias')
          this.router.navigateByUrl('/auditorias/auditorias')         
        }
        else if( ejecucion.step  > 2 && ejecucion.step <= 7 || ejecucion.step  > 8 && ejecucion.step <= 11 ) {
                this.stepper.stepper.selectedIndex = ejecucion.step -1
                this.openDialog( ejecucion.step -1 )
        }
        else {                     
          if( ejecucion.step === 1 ) {  

            this.stepper.stepper.next();    

            this.auditoriasService.onUpdateLocal({
              auditoriaId: this.auditoria()!.id!,
              etapa: Etapa.Ejecución,
              status: false,
              step: ejecucion.step,
              total: this.stepperFields.length
            })
          }

        }
      },
      error:( message ) => {
        this.auditoriasService.notification(message, 4000, 'Error!!!');
     }
    })
    
  }

  onFillFields( selected : number ) {
    this.selected.set(selected)
    this.severalFiles( selected );
    const form = this.stepper.auditoria[selected];   

     if( form ) {

      if( selected  > 1 && selected <= 6 || selected  > 7 && selected <= 10 ) return
        
       this.documentService.getDocument( this.auditoria()!.id!, this.auditoria()!.tipo, selected + 1, 'Ejecución' )
          .subscribe( (document) => {            
            if( document ) {
              
              if(selected === 0 || selected === 1 ){
                form.patchValue({
                  prorroga: this.ejecucion()?.prorroga ? '1' : '0',
                  folio: document.folio,
                  fecha_inicio: new Date( moment(document.fecha_inicio).format('MM-DD-YYYY') ),
                }) 

              }else {
                form.patchValue({
                  ...document,
                  fecha_inicio: new Date( moment(document.fecha_inicio).format('MM-DD-YYYY') ),
                  fecha_termino: new Date( moment(document.fecha_termino).format('MM-DD-YYYY') ),
                }) 
              }

              this.onShowFields( form, selected )
            }
          })
     }
  }

  onShowFields( form: FormGroup, selected: number ) {
    const inputsRules : Field[] = this.stepperFields[selected].fields.filter(field => field.type === 'select' && field.live == true);
  
    if( inputsRules.length > 0 ) 
        inputsRules.map(input => this.stepper.showInputs( true, form.get(input.name)!.value, input.rule!, input.inputs!, selected ) )
  }

  severalFiles( selected : number ) {
    if( selected  > 1 && selected <= 6 || selected  > 7 && selected <= 10 )
        this.docs = true;
    else 
        this.docs = false

    if( (selected  > 1 && selected <= 6 && selected === this.ejecucion()!.step -1) || (selected  > 7 && selected <= 10 && selected === this.ejecucion()!.step -1))
        this.several.set(true);
    else 
        this.several.set(false)
    
  }

  skipStep() {      
    this.ejecucionService.onSkipStep( this.ejecucion()!.id, this.ejecucion()!.step)
    .subscribe({
      next: () => {    
         this.stepper.stepper.selected!.completed = true;
         this.stepper.stepper.next()
      },
      error:( message ) => {
        this.auditoriasService.notification(message, 4000, 'Error!!!');
      }
    })    
  }

  openDialog( step : number ): void {
     
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '350px',
    });

    dialogRef.afterClosed().subscribe(result => {      
     if( !result ){
         this.stepper.stepper.next()
     } else {
       const form = this.stepper.auditoria[step]; 
       this.several.set(true);
       form.reset();
     }
    });
  }

  seeDocuments(){
    const dialogRef = this.dialog.open(DialogTableComponent, {
      width: '850px',
    });
  }

  getDocuments(){
    

    this.documentService.getDocuments( this.auditoria()!.id!, this.selected()! + 1, 'Ejecución' ) 
        .subscribe({
            next: () => {
              this.seeDocuments()
            },
            error: () => {}
         })  
    
    
  }

}
