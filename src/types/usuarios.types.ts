export type UserRole = 'admin' | 'vet' | 'secretaria' | 'cliente | usuario';

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password?: string;
  role: UserRole;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUsuarioDTO {
  nombre: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUsuarioDTO {
  nombre?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
