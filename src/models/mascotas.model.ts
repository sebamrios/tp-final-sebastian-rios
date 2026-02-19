import pool from '../database/mysql';
import {
  Mascota,
  CreateMascotaDTO,
  UpdateMascotaDTO
} from '../types/mascotas.types';


export const createMascota = async (
  data: CreateMascotaDTO
): Promise<number> => {

  const [result]: any = await pool.execute(
    `INSERT INTO mascotas
     (nombre, especie, raza, edad, usuario_id)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.nombre,
      data.especie,
      data.raza,
      data.edad,
      data.usuarioId
    ]
  );

  return result.insertId;
};

export const getMascotasByUsuario = async (
  usuarioId: number
): Promise<Mascota[]> => {

  const [rows] = await pool.execute(
    `SELECT
      m.id,
      m.nombre,
      m.especie,
      m.raza,
      m.edad,
      m.usuario_id AS usuarioId,
      m.created_at AS createdAt,
      u.nombre AS ownerName
     FROM mascotas m
     LEFT JOIN usuarios u ON m.usuario_id = u.id
     WHERE m.usuario_id = ?`,
    [usuarioId]
  );

  return rows as Mascota[];
};

export const updateMascota = async (id: number, data: UpdateMascotaDTO): Promise<boolean> => {
  const [result]: any = await pool.execute(
    `UPDATE mascotas SET nombre = ?, especie = ?, raza = ?, edad = ? WHERE id = ?`,
    [data.nombre, data.especie, data.raza, data.edad, id]
  );
  return result.affectedRows > 0;
};

export const getAllMascotas = async (): Promise<Mascota[]> => {
  const [rows] = await pool.execute(
    `SELECT 
      m.id, 
      m.nombre, 
      m.especie, 
      m.raza, 
      m.edad, 
      m.usuario_id AS usuarioId, 
      m.created_at AS createdAt,
      u.nombre AS ownerName
     FROM mascotas m
     LEFT JOIN usuarios u ON m.usuario_id = u.id`
  );
  return rows as Mascota[];
};

export const deleteMascota = async (id: number): Promise<void> => {
  await pool.execute(
    `DELETE FROM mascotas WHERE id = ?`,
    [id]
  );
};