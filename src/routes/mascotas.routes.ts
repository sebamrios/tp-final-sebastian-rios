import { Router } from 'express';
import {
    registrarMascota,
    listarMascotasPorCliente,
    actualizarMascota,
    listarTodasLasMascotas,
    eliminarMascota
} from '../controllers/mascotas.controllers';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

// Specific routes first
router.get('/cliente/:usuarioId', verifyToken, (req, res, next) => {
    const user = (req as any).user;
    const targetUsuarioId = req.params.usuarioId;

    console.log(`[DEBUG] GET /mascotas/cliente/:usuarioId - User: ${user.id} (${user.role}), Target: ${targetUsuarioId}`);

    // Staff can see any client's pets
    if (user.role === 'admin' || user.role === 'vet' || user.role === 'secretaria') {
        return next();
    }

    // Cliente can ONLY see their own pets (loose equality)
    if (user.role === 'cliente' && user.id == targetUsuarioId) {
        return next();
    }

    return res.status(403).json({ message: "No tienes permisos para ver estas mascotas" });
}, listarMascotasPorCliente);

router.post('/', verifyToken, authorizeRole(['admin', 'vet', 'secretaria']), registrarMascota);
router.get('/all', verifyToken, authorizeRole(['admin', 'vet', 'secretaria']), listarTodasLasMascotas);
router.put('/:id', verifyToken, authorizeRole(['admin', 'vet', 'secretaria']), actualizarMascota);
router.delete('/:id', verifyToken, authorizeRole(['admin', 'vet', 'secretaria']), eliminarMascota);


export default router;