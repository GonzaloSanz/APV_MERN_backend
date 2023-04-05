import Veterinario from "../models/Veterinario.js";
import generarJWT from "../helpers/generarJWT.js";
import generarId from "../helpers/generarId.js";
import { emailOlvidePassword, emailRegistro } from "../helpers/email.js";

// Registrar veterinario
const registrar = async (req, res) => {

    // Extraer el email de la petición
    const { nombre, email } = req.body;

    // Prevenir email duplicado
    const existeEmail = await Veterinario.findOne({ email });

    if (existeEmail) {
        const error = new Error('El correo electrónico ya está registrado');
        res.status(400).json({ msg: error.message });

        return;
    }

    try {
        // Guardar veterinario y retornarlo
        const veterinario = new Veterinario(req.body);
        const veterinarioGuardado = await veterinario.save();

        // Enviar el email para confirmar la cuenta
        emailRegistro({
            nombre,
            email,
            token: veterinarioGuardado.token
        });

        res.json(veterinarioGuardado);

    } catch (error) {
        console.log(error);
    }
};

// COnfirmar cuenta del usuario
const confirmar = async (req, res) => {
    // Extraer el token de la URL
    const { token } = req.params;

    // Comprobar si existe un usuario con ese token
    const usuario = await Veterinario.findOne({ token });

    if (!usuario) {
        const error = new Error('El token no es válido');
        res.status(404).json({ msg: error.message });

        return;
    }

    try {
        // Confirmar la cuenta y vaciar el token
        usuario.confirmado = true;
        usuario.token = '';
        await usuario.save();

        res.json({ msg: 'Usuario confirmado correctamente' });

    } catch (error) {
        console.log(error);
    }
};

// Comprobar login de veterinario
const autenticar = async (req, res) => {
    const { email, password } = req.body;

    // Comprobar si el veterinario existe
    const usuario = await Veterinario.findOne({ email });

    if (!usuario) {
        const error = new Error('El usuario no existe');
        res.status(404).json({ msg: error.message });

        return;
    }

    // Comprobar si la cuenta está confirmada
    if (!usuario.confirmado) {
        const error = new Error('La cuenta no está confirmada');
        res.status(404).json({ msg: error.message });

        return;
    }

    // Revisar si la contraseña es correcta
    if (!await usuario.comprobarPassword(password)) {
        const error = new Error('La contraseña es incorrecta');
        res.status(404).json({ msg: error.message });

        return;
    }

    res.json({
        _id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id)
    });
}

// Solicitar cambio de contraseña
const olvidePassword = async (req, res) => {

    // Extraer la información del veterinario de la petición
    const { email } = req.body;

    // Comprobar si existe un usuario con ese email
    const veterinario = await Veterinario.findOne({ email });

    if (!veterinario) {
        const error = new Error('El correo electrónico no está asociado a ninguna cuenta');
        res.status(404).json({ msg: error.message });

        return;
    }

    // Generar un nuevo token para el usuario
    try {
        veterinario.token = generarId();
        await veterinario.save();

        // Enviar email con instrucciones
        await emailOlvidePassword({
            nombre: veterinario.nombre,
            email,
            token: veterinario.token
        });

        res.json({ msg: 'Hemos enviado un correo electrónico con las instrucciones' });

    } catch (error) {
        console.log(error);
    }
};

// Ajuntar la nueva contraseña
const comprobarToken = async (req, res) => {
    const { token } = req.params;

    // Comprobar si existe un usuario con ese token
    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error('El token no es válido');
        res.status(400).json({ msg: error.message });

        return;
    }

    res.json({ msg: 'EL token es válido y el usuario existe ' });
}

// Cambiar la contraseña
const nuevaPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const veterinario = await Veterinario.findOne({ token });

    if (!veterinario) {
        const error = new Error('El token no es válido');
        res.status(400).json({ msg: error.message });

        return;
    }

    // Modificar la contraseña y vaciar el token
    try {
        veterinario.token = null;
        veterinario.password = password;
        await veterinario.save();

        res.json({ msg: 'Contraseña modificada correctamente' });

    } catch (error) {
        console.log(error);
    }
}


// Mostrar el perfil del veterinario
const perfil = async (req, res) => {
    // Extraer la información del veterinario de la petición
    const { veterinario } = req;

    res.json(veterinario);
};

const actualizarPerfil = async (req, res) => {
    const veterinario = await Veterinario.findById(req.params.id);

    // Si no encuentra ningún veterinario
    if (!veterinario) {
        const error = new Error('Hubo un error');
        return res.status(400).json({ msg: error.message });
    }

    const { nombre, email, web, telefono } = req.body;

    // Verificar que el email no exista ya en caso de haber cambiado
    if (veterinario.email !== email) {
        const existeEmail = await Veterinario.findOne({ email });

        if (existeEmail) {
            const error = new Error('El correo electrónico ya está asociado a otra cuenta');
            return res.status(404).json({ msg: error.message });
        }
    }

    try {
        veterinario.nombre = nombre;
        veterinario.email = email;
        veterinario.web = web;
        veterinario.telefono = telefono;

        const veterinarioActualizado = await veterinario.save();
        res.json(veterinarioActualizado);

    } catch (error) {
        console.log(error);
    }
};

const actualizarPassword = async (req, res) => {
    // Extraer los datos
    const { id } = req.veterinario;
    const { password_actual, password_nueva } = req.body;

    // Comprobar que el usuario existe
    const veterinario = await Veterinario.findById(id);

    if(!veterinario) {
        const error = new Error('El usuario no existe');
        return res.status(400).json({ msg: error.message });
    }

    // Comprobar que la contraseña actual coincida
    if (!await veterinario.comprobarPassword(password_actual)) {
        const error = new Error('La contraseña actual es incorrecta');
        return res.status(400).json({ msg: error.message });
    }

    // Cambiar la contraseña
    veterinario.password = password_nueva;
    await veterinario.save();

    res.json({msg: 'Contraseña cambiada correctamente'});
}

export { registrar, confirmar, autenticar, olvidePassword, comprobarToken, nuevaPassword, perfil, actualizarPerfil, actualizarPassword };

