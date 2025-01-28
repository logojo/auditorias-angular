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
    etapa:           Etapa;
    status:          boolean;  
}

export interface AuditoriaLocal {
    auditoriaId: string; 
    etapa : Etapa;
    status: boolean; 
    step : number;
    total: number;
}

export enum TipoAuditoria {
    Directa = 'Directa',
    Conjunta = 'Conjunta',
    Evaluacion = 'Evaluación',
    Revicion = 'Revisión'
}

export enum Etapa {
    Inicio = 'Inicio',
    Planeación = 'Planeación',
    Ejecución = 'Ejecución',
    Seguimiento = 'Seguimiento',
    Informe = 'Informe',
    Conclusión = 'Conclusión'
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