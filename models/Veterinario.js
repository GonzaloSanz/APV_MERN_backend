import mongoose from "mongoose";
import bcrypt from "bcrypt";
import generarId from "../helpers/generarId.js";

const veterinarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }
});

// Antes de guardar, se hashea la contraseña con 10 rondas de salt
veterinarioSchema.pre("save", async function (next) {

    // Si la contraseña no está siendo modificada, evitar hashearla otra vez y avanzar al siguiente middleware
    if (!this.isModified("password")) {
        next(); // Salta al siguiente middleware 
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario) {
    return await bcrypt.compare(passwordFormulario, this.password);
};

const Veterinario = mongoose.model('Veterinario', veterinarioSchema);
export default Veterinario;