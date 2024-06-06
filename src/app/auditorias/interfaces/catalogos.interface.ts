export interface Catalogos {
    tipos: Tipo[];
    dependencias: Dependencia[];
    programas: Programa[];
    ejercicios: Ejercicio[];
}

export interface Tipo {
    id: string;
    nombre: string;
}
   
export interface Dependencia {
    id: string,
    dependencia: string
}

export interface Programa {
    id: string,
    programa: string
}

export interface Ejercicio {
    id: string,
    ejercicio: number
}