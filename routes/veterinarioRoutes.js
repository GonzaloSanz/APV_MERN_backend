import express from 'express';
import { registrar, autenticar, confirmar, olvidePassword, nuevaPassword, comprobarToken, perfil, actualizarPerfil, actualizarPassword } from '../controllers/veterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';

// Router de Express
const router = express.Router();

// Área Pública
router.post('/', registrar);
router.get('/confirmar/:token', confirmar);
router.post('/login', autenticar);
router.post('/olvide-password', olvidePassword);
router.route('/olvide-password/:token').get(comprobarToken).post(nuevaPassword);

// Área Privada
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;