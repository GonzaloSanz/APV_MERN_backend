import jwt from "jsonwebtoken";
import Veterinario from "../models/Veterinario.js";

const checkAuth = async (req, res, next) => {
    let token;

    // Comprobar si se está enviando un token en las cabeceras y si empeiza por Bearer
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token y se descodificarlo
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Sesión con la información del veterinario, para mandarla al siguiente middleware
            req.veterinario = await Veterinario.findById(decoded.id).select("_id nombre email telefono web");

        } catch (error) {
            const e = new Error('El token no es válido');
            return res.status(403).json({ msg: e.message });
        }
    }

    if (!token) {
        // Si el token no es válido o no existe...
        const error = new Error('El token no existe o no es válido');
        return res.status(403).json({ msg: error.message });
    }

    next();
}

export default checkAuth;