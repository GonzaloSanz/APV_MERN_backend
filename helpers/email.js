import nodemailer from 'nodemailer';

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { nombre, email, token } = datos;

    // Enviar el email
    const info = await transport.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria <administrador@apv.com>",
        to: email,
        subject: 'Comfirma tu cuenta en APV',
        text: 'Confirma tu cuenta en APV',
        html: `<p>Hola ${nombre}, comprueba tu cuenta en APV.</p>
            <p>Tu cuenta ya está lista, solo debes confirmarla a través del siguiente enlace:</p>
            <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a>

            <p>Si no creaste esta cuenta, puedes ignorar este mensaje.</p>

        `
    });
};

const emailOlvidePassword = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { nombre, email, token } = datos;

    // Enviar el email
    const info = await transport.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria <administrador@apv.com>",
        to: email,
        subject: 'Reestablece tu contraseña en APV',
        text: 'Reestablece tu contraseña en APV',
        html: `<p>Hola ${nombre}, has solicitado reestablecer tu contraseña.</p>
                <p>Puedes generar una nueva a través del siguiente enlace:</p>
                <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Contraseña</a>
    
                <p>Si no has solicitado un cambio de contraseña, puedes ignorar este mensaje.</p>
    
            `
    });
}

export { emailRegistro, emailOlvidePassword };