
import { Component, LOCALE_ID, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

import {MatCardModule} from '@angular/material/card';

import { switchMap } from 'rxjs';
import moment from 'moment';

import { AuditoriasService, PlaneacionService, DocumentService } from '../../services';

import { StteperComponent } from '../../components/stteper/stteper.component';

import { Etapa, Field, Stepper, TipoAuditoria } from '../../interfaces/auditorias.interface';
import { PlaneacionRequest, Tipo } from '../../interfaces/planeacion.intererface';
import { InfoDoc } from '../../interfaces/Document.interface';




@Component({
  selector: 'app-planeacion',
  standalone: true,
  providers: [ { provide: LOCALE_ID, useValue: 'es-MX' },],
  imports: [MatCardModule, StteperComponent],
  templateUrl: './planeacion.component.html',
  styleUrl: './planeacion.component.css'
})
export default class PlaneacionComponent {
  
  private auditoriasService = inject( AuditoriasService );
  private planeacionesService = inject( PlaneacionService );
  private documentService = inject( DocumentService );
  private router = inject( Router )

  public auditoria = computed( ()=> this.auditoriasService.auditoria());
  public planeacion = computed( ()=> this.planeacionesService.planeacion());

  public step = signal<number|undefined>(undefined)

  public titles: string[] = [];

  @ViewChild(StteperComponent) stepper! : StteperComponent;

  public stepperFields : Stepper[] = []
   

  constructor() {
    effect(()=> {
      if( this.auditoria() ) {
          this.onGetStepper( this.auditoria()!.tipo )
          this.planeacionesService.getPlaneacion( this.auditoria()!.id! )
          this.step.set(this.planeacion()?.step)
        }
      }, { allowSignalWrites: true })
  }

  onGetStepper( tipo : TipoAuditoria) {
    if( tipo === TipoAuditoria.Directa || tipo === TipoAuditoria.Evaluacion){
      this.stepperFields = [
                            {  
                                id: "paso 1", 
                                fields : [  
                                  { type: 'number', name: 'monto', label: 'Monto Autorizado', value: '', required: true },
                                  { type: 'select',
                                    name: 'tipo', 
                                    label:  'Tipo de Auditoría',
                                    value: '',
                                    required: true, 
                                    live: true,
                                    rule: ['Financiero','Cumplimiento'],
                                    inputs: ['importe','porcentaje'],
                                    options: [           
                                        {value: 'Financiero', label: 'Financiero' },
                                        {value: 'Cumplimiento', label: 'Cumplimiento' },
                                        {value: 'Desempeño', label: 'Desempeño' }
                                    ]
                                  },
                                  { type: 'select', 
                                    name: 'alcance', 
                                    label:  'Alcance', 
                                    required: true,
                                    live: false,
                                    value: '',
                                    options: [
                                        {value: 'Revisado', label: 'Período Revisado' },
                                        {value: 'Financiero', label: 'Alcance Financiero' },            
                                        {value: 'Técnico', label: 'Alcance Técnico' }
                              
                                    ]
                                  },
                                  { type: 'number', name: 'importe', label: 'Importe', value: '', required: false, ruleable: true},
                                  { type: 'number', name: 'porcentaje', label: 'Porcentaje', value: '', required: false, ruleable: true },
                                  { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}
                                
                                  ]
                                },
                                {
                                  id: "paso 2", 
                                  fields : [ 
                                    { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
                                    { type: 'date', name: 'fecha_termino', label: 'Fecha de Termino', value: '', required: true  },
                                    { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}
                                  ]
                                },
                                {
                                  id: "paso 3", 
                                  fields : [ 
                                    { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
                                    { type: 'date', name: 'fecha_termino', label: 'Fecha de Termino', value: '', required: true  },
                                    { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}
                                  ]
                                },
                                {
                                  id: "paso 4", 
                                  fields : [ 
                                    { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
                                    { type: 'date', name: 'fecha_termino', label: 'Fecha de Termino', value: '', required: true  },
                                    { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}
                                  ]
                                },
                                {
                                  id: "paso 5", 
                                  fields : [ 
                                    { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
                                    { type: 'date', name: 'fecha_termino', label: 'Fecha de Termino', value: '', required: true  },
                                    { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}
                                  ]
                                },
                                {
                                  id: "paso 6", 
                                  fields : [ 
                                    { type: 'text', name: 'folio', label: 'No. oficio', value: '', required: true},
                                    { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
                                    { type: 'date', name: 'fecha_termino', label: 'Fecha de Termino', value: '', required: true  },
                                    { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}
                                  ]
                                },
                                {
                                  id: "paso 7", 
                                  fields : [ 
                                    { type: 'select', 
                                      name: 'asisteTitular', 
                                      label:  'Asiste el titular de la Dependencia o Entidad fiscalizada', 
                                      required: true,
                                      value: '',
                                      live: true,
                                      rule: ['1'],
                                      inputs: ['folio','fecha_inicio','nombre_representacion','file'],
                                      options: [
                                          {value: '1', label: 'Sí' },
                                          {value: '2', label: 'No' },       
                                        ]
                                    },
                                    { type: 'text', name: 'folio', label: 'No. oficio', value: '', required: false, ruleable: true},
                                    { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: false, ruleable: true},
                                    { type: 'text', name: 'nombre_representacion', label: 'Nombre del representante', value: '', required: false, ruleable: true  },
                                    { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: false, ruleable: true}
                                  ]
                                },
                                {
                                  id: "paso 8", 
                                  fields : [ 
                                    { type: 'text', name: 'folio', label: 'No. oficio', value: '', required: true},
                                    { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true},
                                    { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}
                                  ]
                                },
                                {
                                  id: "paso 9", 
                                  fields : [ 
                                    { type: 'text', name: 'folio', label: 'No. oficio', value: '', required: true},
                                    { type: 'date', name: 'fecha_inicio', label: 'Fecha de inicio', value: '', required: true},
                                    { type: 'date', name: 'fecha_termino', label: 'Fecha de termino', value: '', required: true},
                                    { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}
                                  ]
                                },
                                  
                          ]

                this.titles = [
                  'Programa de trabajo',               
                  'Cronograma de Actividades - Estimado',
                  'Cronograma de Actividades - Real',
                  'Cronograma de Seguimiento - Estimado',
                  'Cronograma de Seguimiento - Real',
                  'Oficio de notificación y citación para el inicio de Auditoría a las Dependencia o Entidad ejecutora del recurso',
                  'Oficio de Representación y/o designación de enlace de auditoria por parte del Gobierno del Estado de Zacatecas',
                  'Orden de Auditoría',
                  'Acta de Inicio de Auditoría',
                ]
    }
    else if( tipo === TipoAuditoria.Conjunta ) {
      this.stepperFields = [
        {
          id: "paso 1", 
          fields : [
            { type: 'date', name: 'fecha_inicio', label: 'Fecha de Inicio', value: '', required: true },
            { type: 'file', name: 'file',  label: 'Subir Archivo', value: '', required: true },
          ]  
        },
        {
          id: "paso 2", 
          fields : [ 
                  { type: 'number', name: 'monto', label: 'Monto Autorizado', value: '', required: true },
                  { type: 'select',
                    name: 'tipo', 
                    label:  'Tipo de Auditoría',
                    value: '',
                    required: true, 
                    live: true,
                    rule: ['Financiero','Cumplimiento'],
                    inputs: ['importe','porcentaje'],
                    options: [           
                        {value: 'Financiero', label: 'Financiero' },
                        {value: 'Cumplimiento', label: 'Cumplimiento' },
                        {value: 'Desempeño', label: 'Desempeño' }
                    ]
                  },
                  { type: 'select', 
                    name: 'alcance', 
                    label:  'Alcance', 
                    required: true,
                    live: false,
                    value: '',
                    options: [
                        {value: 'Revisado', label: 'Período Revisado' },
                        {value: 'Financiero', label: 'Alcance Financiero' },            
                        {value: 'Técnico', label: 'Alcance Técnico' }              
                    ]
                  },
                  { type: 'number', name: 'importe', label: 'Importe', value: '', required: false, ruleable: true},
                  { type: 'number', name: 'porcentaje', label: 'Porcentaje', value: '', required: false, ruleable: true },
                  { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}            
              ]  
        },
        {
          id: "paso 3", 
          fields : [ 
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha', value: '', required: true },
            { type: 'text', name: 'nombre_enlace', label: 'Nombre del enlace designado', value: '', required: true},
            { type: 'text', name: 'cargo_enlace', label: 'Cargo del enlace designado',  value: '', required: true},
            { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}            
          ]
        },
        {
          id: "paso 4", 
          fields : [ 
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha', value: '', required: true },
            { type: 'text', name: 'nombre_enlace', label: 'Nombre del enlace designado', value: '', required: true},
            { type: 'text', name: 'cargo_enlace', label: 'Cargo del enlace designado',  value: '', required: true},
            { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}            
          ]
        },
        {
          id: "paso 5", 
          fields : [ 
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha', value: '', required: true },
            { type: 'text', name: 'nombre_enlace', label: 'Nombre del enlace designado', value: '', required: true},
            { type: 'text', name: 'cargo_enlace', label: 'Cargo del enlace designado',  value: '', required: true},
            { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}            
          ]
        },
        {
          id: "paso 6", 
          fields : [ 
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha', value: '', required: true },
            { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}            
          ]
        },
        {
          id: "paso 7", 
          fields : [ 
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha', value: '', required: true },
            { type: 'date', name: 'fecha_termino', label: 'Fecha limite para la entrega de la información', value: '', required: true },
            { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}            
          ]
        },
        {
          id: "paso 8", 
          fields : [ 
            { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
            { type: 'date', name: 'fecha_inicio', label: 'Fecha', value: '', required: true },
            { type: 'date', name: 'fecha_termino', label: 'Fecha limite para la entrega de la información', value: '', required: true },
            { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}            
          ]
        }

      ];

      this.titles = [
        'Programa Anual de Fiscalización',
        'Carta Planeación',
        'Orden de Auditoría',
        'Oficio de Representación y/o designación de enlace de auditoria por parte del Gobierno del Estado de Zacatecas',
        'Oficio de Designación de coordinación de la auditoría por parte del enlace designado por el Gobierno del Estado de Zacatecas',
        'Oficio de notificación y citación para el inicio de Auditoría a la Dependencia o Entidad ejecutora del recurso',
        'Acta de Inicio de Auditoría',
        'Oficio de envío del acta de Inicio y requerimientos de información de las Dependencias y Entidades ejecutoras del recurso'
      ]

    } else {
      this.stepperFields = [
                {  
                    id: "paso 1", 
                    fields : [ 
                      { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
                      { type: 'date', name: 'fecha_inicio', label: 'Fecha', value: '', required: true },
                      { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}  
                    ]
                },
                {  
                  id: "paso 2", 
                  fields : [ 
                    { type: 'text', name: 'folio', label: 'No. de Oficio', value: '', required: true},
                    { type: 'date', name: 'fecha_inicio', label: 'Fecha', value: '', required: true },
                    { type: 'text', name: 'nombre_enlace', label: 'Nombre del enlace designado', value: '', required: true},
                    { type: 'text', name: 'cargo_enlace', label: 'Cargo del enlace designado',  value: '', required: true},
                    { type: 'file', name: 'file', label: 'Subir Archivo', value: '', required: true}  
                  ]
              }
            ]
        this.titles = [
          'Oficio de notificación y citación para el inicio de Auditoría emitido por la SFPZ a la Dependencia o Entidades ejecutora del recurso',
          'Oficio de Representación y/o designación de enlace de auditoria por parte del Gobierno del Estado de Zacatecas',
        ]
    }
  }
  
  onSave( planeacion  : PlaneacionRequest  ) {
   
    const infoDoc : InfoDoc = {
     dependencia: this.auditoria()!.siglas,
     folio: this.auditoria()!.folio,
     tipo: this.auditoria()!.tipo,
     step: ''+planeacion.step,
     etapa: Etapa.Planeación
   }
  
     
    this.documentService.onSaveFile( planeacion.file!, infoDoc )
    .pipe(
      switchMap( (res) => {
        delete planeacion.file

        if( planeacion.tipo === Tipo.Desempeño){
            delete planeacion.importe;
            delete planeacion.porcentaje
        }       

        let plan : PlaneacionRequest = { ...planeacion, archivo: res.secureUrl, auditoriaId: this.auditoria()!.id!, total: this.stepperFields.length  }
        return this.planeacionesService.onSave( plan )
      })
    )
    .subscribe({
      next: () => {        
        this.auditoriasService.notification('Paso completado', 3000, 'Bien!!!');
        if( planeacion.step === this.stepperFields.length ) {
          this.auditoriasService.onUpdateLocal({
            auditoriaId: this.auditoria()!.id!,
            etapa: Etapa.Planeación,
            status: true,
            step: planeacion.step,
            total: this.stepperFields.length
          })
          localStorage.setItem('url', '/auditorias/auditorias')
          this.router.navigateByUrl('/auditorias/auditorias')
         
        }else {
          this.stepper.stepper.next()

          if( planeacion.step === 1 ) {
            this.auditoriasService.onUpdateLocal({
              auditoriaId: this.auditoria()!.id!,
              etapa: Etapa.Planeación,
              status: false,
              step: planeacion.step,
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
     const form = this.stepper.auditoria[selected];   
     
     if( form ) {
     
      if( selected === 0 && this.auditoria()?.tipo === TipoAuditoria.Directa ||
          selected === 0 && this.auditoria()?.tipo === TipoAuditoria.Evaluacion ||
          selected === 1 && this.auditoria()?.tipo === TipoAuditoria.Conjunta) { 
          
          form.patchValue({
            monto: this.planeacion()?.monto,
            tipo: this.planeacion()?.tipo,
            alcance: this.planeacion()?.alcance,
            importe: this.planeacion()?.importe,
            porcentaje: this.planeacion()?.porcentaje
          })

          this.onShowFields( form, selected )

      }else if( selected === 6 ) {
        this.documentService.getDocument( this.auditoria()!.id!, this.auditoria()!.tipo, selected + 1, 'Planeación' )
          .subscribe( (document) => {            
            if( document ) {  
              form.patchValue({
                asisteTitular: this.planeacion()?.asisteTitular ? '1' : '2',
                folio: document.folio,
                fecha_inicio: new Date( moment(document.fecha_inicio).format('MM-DD-YYYY') ),
                fecha_termino: new Date( moment(document.fecha_termino).format('MM-DD-YYYY') ),
                nombre_representacion: document.nombre_representacion,
              })
              this.onShowFields( form, selected )
            }
          })
          
      } else {
        
        this.documentService.getDocument( this.auditoria()!.id!, this.auditoria()!.tipo, selected + 1, 'Planeación' )
          .subscribe( (document) => {            
            if( document ) {              
              form.patchValue({
                ...document,
                fecha_inicio: new Date( moment(document.fecha_inicio).format('MM-DD-YYYY') ),
                fecha_termino: new Date( moment(document.fecha_termino).format('MM-DD-YYYY') ),
              }) 

              this.onShowFields( form, selected )
            }
          })
      }
    }
  }

  onShowFields( form: FormGroup, selected: number ) {
    const inputsRules : Field[] = this.stepperFields[selected].fields.filter(field => field.type === 'select' && field.live == true);
  
    if( inputsRules.length > 0 ) 
        inputsRules.map(input => this.stepper.showInputs( true, form.get(input.name)!.value, input.rule!, input.inputs!, selected ) )
  }
    
}
