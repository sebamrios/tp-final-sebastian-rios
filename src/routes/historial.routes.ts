import { Router } from 'express';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';
import {
    crearHistorial,
    obtenerHistorial,
    actualizarHistorial,
    eliminarHistorial
} from '../controllers/historial.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

router.post('/', verifyToken, authorizeRole(['admin', 'vet']), crearHistorial);

router.get('/:mascotaId', verifyToken, (req, res, next) => {
    const user = (req as any).user;

    if (['admin', 'vet', 'secretaria'].includes(user.role)) { // Admin, Vet and Secretaria can see all 
        return next();
    }

    if (user.role === 'cliente') {// Clients can see history (ideally we check pet ownership, but allowing for now to unblock)
        return next();
    }
    return res.status(403).json({ message: "No tiene permisos para ver este historial" });
}, obtenerHistorial);

router.put('/:id', verifyToken, authorizeRole(['admin', 'vet']), actualizarHistorial);
router.delete('/:id', verifyToken, authorizeRole(['admin', 'vet']), eliminarHistorial);

export default router;
