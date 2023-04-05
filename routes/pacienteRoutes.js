import express from 'express';
import checkAuth from '../middleware/authMiddleware.js';
import { obtenerPacientes, obtenerPaciente, agregarPaciente, actualizarPaciente, eliminarPaciente } from '../controllers/pacienteController.js';

// Router de Express
const router = express.Router();

router.route('/')
    .get(checkAuth, obtenerPacientes)
    .post(checkAuth, agregarPaciente);

router.route('/:id')
    .get(checkAuth, obtenerPaciente)
    .put(checkAuth, actualizarPaciente)
    .delete(checkAuth, eliminarPaciente);

export default router;
