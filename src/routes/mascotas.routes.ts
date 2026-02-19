import { Router } from 'express';
import {
    registrarMascota,
    listarMascotasPorCliente,
    actualizarMascota,
    listarTodasLasMascotas,
    eliminarMascota
} from '../controllers/mascotas.controllers';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', verifyToken, registrarMascota);
router.get('/', verifyToken, listarTodasLasMascotas);
router.put('/:id', verifyToken, actualizarMascota);
router.delete('/:id', verifyToken, eliminarMascota);
router.get('/cliente/:usuarioId', verifyToken, listarMascotasPorCliente);


export default router;