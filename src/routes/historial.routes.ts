import { Router } from 'express';
import { verifyToken } from '../middlewares/auth.middleware';
import {
    crearHistorial,
    obtenerHistorial,
    actualizarHistorial,
    eliminarHistorial
} from '../controllers/historial.controller';

const router = Router();

// Todas las rutas requieren autenticación
router.use(verifyToken);

router.post('/', verifyToken, crearHistorial);
router.get('/:mascotaId', verifyToken, obtenerHistorial);
router.put('/:id', verifyToken, actualizarHistorial);
router.delete('/:id', verifyToken, eliminarHistorial);

export default router;
