import pool from '../database/mysql';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import {
  Usuario,
  CreateUsuarioDTO,
  UpdateUsuarioDTO
} from '../types/usuarios.types';

export const createUsuario = async (
  user: CreateUsuarioDTO
): Promise<number> => {
  const [result] = await pool.execute<ResultSetHeader>(
    `INSERT INTO usuarios (nombre, email, password, role)
     VALUES (?, ?, ?, ?)`,
    [user.nombre, user.email, user.password, user.role]
  );

  return result.insertId;
};

export const findUsuarioById = async (
  id: number
): Promise<Usuario | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, nombre, email, password, role, created_at
     FROM usuarios
     WHERE id = ?`,
    [id]
  );

  return rows.length ? (rows[0] as Usuario) : null;
};

export const findUsuarioByEmail = async (
  email: string
): Promise<Usuario | null> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, nombre, email, password, role, created_at
     FROM usuarios
     WHERE email = ?`,
    [email]
  );

  return rows.length ? (rows[0] as Usuario) : null;
};

export const getAllUsuarios = async (): Promise<Usuario[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    `SELECT id, nombre, email, role, created_at FROM usuarios`
  );

  return rows as Usuario[];
};

export const updateUsuario = async (
  id: number,
  data: UpdateUsuarioDTO
): Promise<void> => {
  const fields: string[] = [];
  const values: any[] = [];

  for (const key in data) {
    if (data[key as keyof UpdateUsuarioDTO] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(data[key as keyof UpdateUsuarioDTO]);
    }
  }

  if (!fields.length) return;

  values.push(id);

  await pool.execute(
    `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
    values
  );
};

export const deleteUsuario = async (id: number): Promise<void> => {
  await pool.execute(
    `DELETE FROM usuarios WHERE id = ?`,
    [id]
  );
};

export const getClientes = async (): Promise<Usuario[]> => {
  const [rows] = await pool.execute<RowDataPacket[]>(
    'SELECT id, nombre, email, role FROM usuarios WHERE role = "cliente"'
  );
  return rows as Usuario[];
};