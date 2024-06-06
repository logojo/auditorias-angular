export interface Document {
    folio: string;
    fecha_inicio: string;
    fecha_termino: string;
    nombre_representacion: string;
    nombre_enlace: string;
    cargo_enlace: string;
    tipo_doc: DocumentType;
}

export interface InfoDoc {
    dependencia: string;
    folio: string;
    tipo: string;
    step: string;
    etapa: string;
}

export enum Oficio  {
    A = 'Ampliación de programa(s), rubro(s), ejercicio(s), capitulo(s), área(s)',
    B = 'Ampliación de personal del grupo de auditorias',
    C = 'Requerimientos de información adicional',
}
