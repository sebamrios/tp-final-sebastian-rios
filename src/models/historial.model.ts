import pool from '../database/mysql';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import {
    HistorialClinico,
    CreateHistorialDTO,
    UpdateHistorialDTO
} from '../types/historial.types';

/**
 * Crear registro en historial clínico
 */
export const createHistorial = async (
    data: CreateHistorialDTO
): Promise<number> => {
    const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO historial_clinico (mascota_id, veterinario_id, observaciones, diagnostico, tratamiento)
     VALUES (?, ?, ?, ?, ?)`,
        [
            data.mascotaId,
            data.veterinarioId,
            data.observaciones,
            data.diagnostico,
            data.tratamiento
        ]
    );
    return result.insertId;
};

/**
 * Obtener historial de una mascota
 */
export const getHistorialByMascota = async (
    mascotaId: number
): Promise<HistorialClinico[]> => {
    const [rows] = await pool.execute<RowDataPacket[]>(
        `SELECT 
      h.id,
      h.mascota_id AS mascotaId,
      h.veterinario_id AS veterinarioId,
      h.fecha,
      h.observaciones,
      h.diagnostico,
      h.tratamiento,
      h.created_at AS createdAt,
      u.nombre AS veterinarioNombre
     FROM historial_clinico h
     LEFT JOIN usuarios u ON h.veterinario_id = u.id
     WHERE h.mascota_id = ?
     ORDER BY h.fecha DESC`,
        [mascotaId]
    );
    return rows as HistorialClinico[];
};

/**
 * Actualizar registro (solo el veterinario que lo creó o admin podría, pero por ahora simplificado)
 */
export const updateHistorial = async (
    id: number,
    data: UpdateHistorialDTO
): Promise<void> => {
    const fieldMapping: Record<string, string> = {
        'observaciones': 'observaciones',
        'diagnostico': 'diagnostico',
        'tratamiento': 'tratamiento',
        'mascotaId': 'mascota_id',
        'veterinarioId': 'veterinario_id'
    };

    const fields: string[] = [];
    const values: any[] = [];

    for (const key in data) {
        if (data[key as keyof UpdateHistorialDTO] !== undefined) {
            const dbColumn = fieldMapping[key] || key;
            fields.push(`${dbColumn} = ?`);
            values.push(data[key as keyof UpdateHistorialDTO]);
        }
    }

    if (!fields.length) return;

    values.push(id);

    const sql = `UPDATE historial_clinico SET ${fields.join(', ')} WHERE id = ?`;
    console.log('SQL:', sql);
    console.log('Values:', values);

    await pool.execute(sql, values);
};

/**
 * Eliminar registro
 */
export const deleteHistorial = async (id: number): Promise<void> => {
    await pool.execute(
        `DELETE FROM historial_clinico WHERE id = ?`,
        [id]
    );
};
