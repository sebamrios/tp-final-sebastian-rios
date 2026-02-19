import { Request, Response } from 'express';
import * as MascotaService from '../services/mascotas.service';
import { CreateMascotaDTO } from '../types/mascotas.types';


export const registrarMascota = async (req: Request, res: Response) => {
    try {
        console.log("--- Petición Recibida ---");
        console.log("Body:", req.body);

        // 2. Extraemos los campos (el curl envía id_usuario)
        const { nombre, especie, raza, edad, id_usuario } = req.body;

        // 3. Validamos que el id_usuario no sea undefined antes de seguir
        if (id_usuario === undefined || id_usuario === null) {
            console.error(" Error: id_usuario no llegó en el body");
            return res.status(400).json({
                message: "El campo id_usuario es obligatorio para vincular la mascota."
            });
        }

        const datosMascota: CreateMascotaDTO = {
            nombre,
            especie,
            raza,
            edad,
            usuarioId: id_usuario
        };

        console.log("DTO enviado al Service:", datosMascota);

        const insertId = await MascotaService.registrarNuevaMascota(datosMascota);

        res.status(201).json({
            message: "Mascota creada correctamente",
            id: insertId
        });

    } catch (error: any) {
        console.error(" Error en registrarMascota:", error.message);
        res.status(500).json({
            message: "Error al registrar mascota",
            error: error.message
        });
    }
};


export const listarMascotasPorCliente = async (req: Request, res: Response) => {
    try {
        const { usuarioId } = req.params;

        if (!usuarioId) {
            return res.status(400).json({ message: "ID de usuario requerido" });
        }

        const mascotas = await MascotaService.obtenerMascotasDeUsuario(Number(usuarioId));
        res.json(mascotas);

    } catch (error: any) {
        res.status(500).json({
            message: 'Error al obtener mascotas',
            error: error.message
        });
    }
};

export const actualizarMascota = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { nombre, especie, raza, edad } = req.body;

        const exito = await MascotaService.editarMascota(Number(id), {
            nombre,
            especie,
            raza,
            edad
        });

        if (exito) {
            res.json({ message: "Mascota actualizada correctamente" });
        } else {
            res.status(404).json({ message: "No se encontró la mascota para actualizar" });
        }
    } catch (error: any) {
        res.status(500).json({ message: "Error al actualizar", error: error.message });
    }
};

export const listarTodasLasMascotas = async (_req: Request, res: Response) => {
    try {
        const mascotas = await MascotaService.obtenerTodasLasMascotas();
        res.json(mascotas);
    } catch (error: any) {
        res.status(500).json({
            message: "Error al obtener el listado completo",
            error: error.message
        });
    }
};

export const eliminarMascota = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        console.log("Intentando eliminar la mascota con ID:", id);
        await MascotaService.eliminarMascota(Number(id));

        res.json({
            message: `Mascota con ID ${id} eliminada con éxito (Ruta Protegida)`
        });

    } catch (error: any) {
        console.error("Error al eliminar:", error.message);
        res.status(500).json({
            message: "Error al eliminar la mascota",
            error: error.message
        });
    }
};