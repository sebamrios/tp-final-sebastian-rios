import { Request, Response } from 'express';
import {
    createHistorial,
    getHistorialByMascota,
    updateHistorial,
    deleteHistorial
} from '../models/historial.model';
import { CreateHistorialDTO, UpdateHistorialDTO } from '../types/historial.types';

export const crearHistorial = async (req: Request, res: Response): Promise<any> => {
    try {
        const userRole = (req as any).user.role;

        if (userRole !== 'vet' && userRole !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
        }

        const { mascotaId, observaciones, diagnostico, tratamiento } = req.body;
        const veterinarioId = (req as any).user.id;

        if (!mascotaId || !observaciones || !diagnostico || !tratamiento) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const nuevoHistorial: CreateHistorialDTO = {
            mascotaId,
            veterinarioId,
            observaciones,
            diagnostico,
            tratamiento
        };

        const id = await createHistorial(nuevoHistorial);

        res.status(201).json({ message: 'Historial creado exitosamente', id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el historial' });
    }
};

export const obtenerHistorial = async (req: Request, res: Response): Promise<any> => {
    try {
        const { mascotaId } = req.params;
        const historial = await getHistorialByMascota(Number(mascotaId));

        res.json(historial);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el historial' });
    }
};

export const actualizarHistorial = async (req: Request, res: Response): Promise<any> => {
    try {
        const userRole = (req as any).user.role;

        if (userRole !== 'vet' && userRole !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
        }

        const { id } = req.params;
        const data: UpdateHistorialDTO = req.body;

        console.log('Actualizando historial:', { id, data });

        await updateHistorial(Number(id), data);

        res.json({ message: 'Historial actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar historial:', error);
        res.status(500).json({ message: 'Error al actualizar el historial' });
    }
};

export const eliminarHistorial = async (req: Request, res: Response): Promise<any> => {
    try {
        const userRole = (req as any).user.role;

        if (userRole !== 'vet' && userRole !== 'admin') {
            return res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
        }

        const { id } = req.params;
        await deleteHistorial(Number(id));

        res.json({ message: 'Historial eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el historial' });
    }
};
