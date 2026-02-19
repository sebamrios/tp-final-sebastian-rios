export type Especie = 'perro' | 'gato' | 'otro';


export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  usuarioId: number;
  ownerName?: string;
  createdAt?: Date;
}


export interface CreateMascotaDTO {
  nombre: string;
  especie: Especie;
  raza: string;
  edad: number;
  usuarioId: number;
}

export interface UpdateMascotaDTO {
  nombre?: string;
  especie?: Especie;
  raza?: string;
  edad?: number;
}



