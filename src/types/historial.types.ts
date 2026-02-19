export interface HistorialClinico {
    id: number;
    mascotaId: number;
    veterinarioId: number;
    fecha: Date;
    observaciones: string;
    diagnostico: string;
    tratamiento: string;
    createdAt?: Date;
}

export interface CreateHistorialDTO {
    mascotaId: number;
    veterinarioId: number;
    observaciones: string;
    diagnostico: string;
    tratamiento: string;
}

export interface UpdateHistorialDTO {
    observaciones?: string;
    diagnostico?: string;
    tratamiento?: string;
    veterinarioId?: number;
}
