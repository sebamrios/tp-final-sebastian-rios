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
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/', createUsuario);

router.get('/', verifyToken, getUsuarios);
router.get('/clientes', verifyToken, getUsuariosClientes);
router.get('/:id', verifyToken, getUsuarioById);

router.put('/:id', verifyToken, updateUsuario);
router.delete('/:id', verifyToken, deleteUsuario);

export default router;