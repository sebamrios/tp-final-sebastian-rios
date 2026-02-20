import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: "Token no proporcionado" });
  }

  try {
    const secret = process.env.JWT_SECRET || 'clave_secreta_utn_2026';
    const decoded = jwt.verify(token, secret);
    (req as any).user = decoded;
    console.log(`[AUTH] Token Verified: User ID: ${(decoded as any).id}, Role: ${(decoded as any).role}, URL: ${req.originalUrl}`);
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

/**
 * Middleware para autorizar roles específicos
 */
export const authorizeRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }

    if (!allowedRoles.includes(user.role)) {
      console.log(`[AUTH] Access Denied: User Role: "${user.role}", Allowed: ${JSON.stringify(allowedRoles)}, URL: ${req.url}, OriginalURL: ${req.originalUrl}`);
      return res.status(403).json({
        message: "No tienes permisos para realizar esta acción",
        requiere: allowedRoles.join(' o ')
      });
    }

    next();
  };
};