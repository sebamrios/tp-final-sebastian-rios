import { Router } from 'express';
import {
    getUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    getUsuariosClientes
} from '../controllers/users.controller';
import { login } from '../controllers/auth.controllers';
import { verifyToken, authorizeRole } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/', createUsuario);

router.get('/clientes', verifyToken, authorizeRole(['admin', 'vet', 'secretaria']), getUsuariosClientes);
router.get('/all', verifyToken, authorizeRole(['admin', 'vet', 'secretaria']), getUsuarios);

router.get('/:id', verifyToken, (req, res, next) => {
    const user = (req as any).user;
    const targetId = req.params.id;

    console.log(`[DEBUG] GET /users/:id - User JWT ID: ${user.id} (${user.role}), Target Param ID: ${targetId}`);

    // Admin and Vet can see any user
    if (user.role === 'admin' || user.role === 'vet') {
        return next();
    }

    // Cliente can ONLY see their own profile (loose equality)
    if (user.role === 'cliente' && user.id == targetId) {
        return next();
    }

    console.log(`[DEBUG] Access Denied: User ${user.id} tried to see ${targetId}`);
    return res.status(403).json({ message: "No tienes permisos para ver este perfil" });
}, getUsuarioById);

router.put('/:id', verifyToken, authorizeRole(['admin']), updateUsuario);
router.delete('/:id', verifyToken, authorizeRole(['admin']), deleteUsuario);

export default router;