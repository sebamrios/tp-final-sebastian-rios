import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as usuariosModel from '../models/usuarios.model';
import {
  Usuario,
  CreateUsuarioDTO,
  UpdateUsuarioDTO,
  UserRole
} from '../types/usuarios.types';

/**
 * Obtener todos los usuarios
 */
export const getAllUsers = async (): Promise<Usuario[]> => {
  return await usuariosModel.getAllUsuarios();
};

/**
 * Obtener usuario por ID
 */
export const getUserById = async (id: number): Promise<Usuario> => {
  const user = await usuariosModel.findUsuarioById(id);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  return user;
};

/**
 * Registro de Usuario (con Hash de contraseña)
 */
export const createUser = async (
  email: string,
  password: string,
  role: UserRole,
  nombre?: string
): Promise<number> => {

  const existingUser = await usuariosModel.findUsuarioByEmail(email);
  if (existingUser) {
    throw new Error('El email ya está registrado');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: CreateUsuarioDTO = {
    nombre: nombre || email.split('@')[0],
    email,
    password: hashedPassword,
    role
  };

  const userId = await usuariosModel.createUsuario(newUser);
  return userId;
};

/**
 * Login de Usuario y generación de JWT
 */
export const login = async (email: string, passwordPlana: string) => {
  // 1. Buscar si el usuario existe
  const user = await usuariosModel.findUsuarioByEmail(email);
  if (!user) {
    throw new Error('Credenciales incorrectas');
  }

  if (!user.password) {
    throw new Error('El usuario no tiene una contraseña definida en la base de datos');
  }

  const isMatch = await bcrypt.compare(passwordPlana, user.password);
  if (!isMatch) {
    throw new Error('Credenciales incorrectas');
  }

  const secret = process.env.JWT_SECRET || 'clave_secreta_utn_2026';

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    secret,
    { expiresIn: '4h' }
  );

  return {
    token,
    user: { id: user.id, nombre: user.nombre, email: user.email, role: user.role }
  };
};

/**
 * Actualizar usuario
 */
export const updateUser = async (
  userId: number,
  updatedFields: UpdateUsuarioDTO
): Promise<void> => {

  const user = await usuariosModel.findUsuarioById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  if (updatedFields.password) {
    updatedFields.password = await bcrypt.hash(updatedFields.password, 10);
  }

  await usuariosModel.updateUsuario(userId, updatedFields);
};

/**
 * Eliminar usuario
 */
export const deleteUser = async (userId: number): Promise<void> => {
  const user = await usuariosModel.findUsuarioById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }
  await usuariosModel.deleteUsuario(userId);
};

/**
 * Obtener solo clientes
 */
export const obtenerSoloClientes = async () => {
  return await usuariosModel.getClientes();
};

/**
 * Reglas de autorización
 */
export const canCreateUsers = (role: UserRole): boolean => {
  return role === 'admin';
};

export const canDeleteUsers = (role: UserRole): boolean => {
  return role === 'admin';
};