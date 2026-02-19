import { Request, Response } from 'express';
import * as usuariosService from '../services/usuarios.service';
import { UserRole } from '../types/usuarios.types';


export const getUsuarios = async (req: Request, res: Response) => {
  try {
    const usuarios = await usuariosService.getAllUsers();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};


export const getUsuarioById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    const usuario = await usuariosService.getUserById(id);
    res.json(usuario);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};


export const createUsuario = async (req: Request, res: Response) => {
  try {
    const { email, password, role, nombre } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: 'email, password y role son obligatorios'
      });
    }

    const userId = await usuariosService.createUser(
      email,
      password,
      role as UserRole,
      nombre
    );

    res.status(201).json({
      message: 'Usuario creado correctamente',
      userId
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const updateUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    await usuariosService.updateUser(id, req.body);

    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const deleteUsuario = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    await usuariosService.deleteUser(id);

    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};


export const getUsuariosClientes = async (_req: Request, res: Response) => {
  try {
    const clientes = await usuariosService.obtenerSoloClientes();
    res.json(clientes);
  } catch (error: any) {
    res.status(500).json({ message: "Error al obtener clientes", error: error.message });
  }
};