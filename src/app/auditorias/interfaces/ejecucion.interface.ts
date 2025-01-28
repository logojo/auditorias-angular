export interface EjecucionRequest {
    prorroga?: boolean
    plazo?: boolean;
    folio?: string;
    fecha_inicio?: string;
    fecha_termino?: string;
    nombre_representacion?:string;
    step: number
    auditoriaId: string;
    archivo: string;
    total:number;
    several?:boolean;
    file?: File
}


export interface Ejecucion {
    id: string; 
    prorroga?: boolean
    plazo?: boolean;
    step: number; 
    auditoriaId: string; 
  }