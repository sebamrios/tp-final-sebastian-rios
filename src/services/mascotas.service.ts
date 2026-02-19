import * as MascotaModel from '../models/mascotas.model';
import { CreateMascotaDTO, UpdateMascotaDTO } from '../types/mascotas.types';

export const registrarNuevaMascota = async (datos: CreateMascotaDTO) => {

    const insertId = await MascotaModel.createMascota(datos);
    return insertId;
};

export const obtenerMascotasDeUsuario = async (usuarioId: number) => {
    return await MascotaModel.getMascotasByUsuario(usuarioId);
};

export const editarMascota = async (mascotaId: number, datos: UpdateMascotaDTO) => {
    return await MascotaModel.updateMascota(mascotaId, datos);
};

export const obtenerTodasLasMascotas = async () => {
    return await MascotaModel.getAllMascotas();
};

export const eliminarMascota = async (id: number) => {
    const resultado = await MascotaModel.deleteMascota(id);
    return resultado;
};