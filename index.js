import express from "express";
import dotenv from 'dotenv';
import conectarDB from "./config/db.js";
import veterinarioRoutes from './routes/veterinarioRoutes.js';
import pacienteRoutes from './routes/pacienteRoutes.js';
import cors from 'cors';

// Crear la aplicación con Express
const app = express();

// Habilitar envío de datos de tipo JSON
app.use(express.json());

// Buscar y escanear el archivo .env
dotenv.config();

// Conectar a la base de datos de MongoDB
conectarDB();

// Habilitar dominio para evitar el bloqueo CORS
const dominiosPermitidos = [process.env.FRONTEND_URL];
// Opciones
const corsOpciones = {
  origin: function (origin, callback) {
    if (dominiosPermitidos.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Dominio no permitido por CORS"));
    }
  },
};

app.use(cors(corsOpciones));

app.use('/api/veterinarios', veterinarioRoutes);
app.use('/api/pacientes', pacienteRoutes);

// Puerto de la aplicación
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor funcionando en el puerto ${PORT}`);
});