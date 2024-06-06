export interface AuditoriasResponse {
    items: Auditoria[];
    meta: Meta;
}

export interface Meta {
    totalItems  : number;
    itemCount   : number;
    itemsPerPage: number;
    totalPages  : number;
    currentPage : number;
  }

export interface Auditoria {
    id?:             string;
    tipo:            TipoAuditoria;
    folio:           string;
    representantes?: string;
    programa:        string;
    ejercicio:       number;
    dependencia:     string;
    siglas:          string;
    etapa:           string;
    status:          boolean;  
}

export interface AuditoriaLocal {
    auditoriaId: string; 
    etapa : string;
    status: boolean; 
    step : number;
    total: number;
}

export enum TipoAuditoria {
    Directas = 'Directa',
    Conjuntas = 'Conjunta',
    Evaluaciones = 'Evaluación',
    Reviciones = 'Revisión'
}

export interface Stepper {
  id: string;
  fields: Field[];
}

export interface Field {
    id?       : string
    type      : string;
    name      : string;
    label     : string;
    value     : string;
    options?  : Options[];
    required? : boolean;
    live?     : boolean;
    rule?     : string[];
    inputs?   : string[];
    ruleable?  :  boolean;

}

export interface Options {
    value: string|number;
    label: string;
}