import { Request, Response } from 'express';
import * as UsuarioService from '../services/usuarios.service';

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y password son requeridos" });
        }

        const result = await UsuarioService.login(email, password);
        res.json({
            message: "Login exitoso",
            ...result
        });

    } catch (error: any) {
        res.status(401).json({
            message: "Error de autenticación",
            error: error.message
        });
    }
};