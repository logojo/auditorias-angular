export interface PlaneacionRequest {
    monto?: number;
    tipo?: Tipo;
    alcance?: Alcance;
    importe?: number;
    porcentaje?:number;
    asisteTitular?: boolean;
    folio?: string;
    fecha_inicio?: string;
    fecha_termino?: string;
    nombre_representacion?:string;
    step: number
    auditoriaId: string;
    archivo: string;
    total:number;
    file?: File
}

export interface Planeacion {
    id: string; 
    monto: string; 
    tipo: Tipo; 
    alcance: Alcance; 
    importe: number; 
    porcentaje: number; 
    asisteTitular: boolean; 
    step: number; 
    auditoriaId: string; 
  }

export enum Tipo {
    Financiero = 'Financiero',
    Cumplimiento = 'Cumplimiento',
    Desempeño = 'Desempeño',
}

export enum Alcance {
    Revisado = 'Revisado',
    Financiero = 'Financiero',
    Técnico = 'Técnico'
}
