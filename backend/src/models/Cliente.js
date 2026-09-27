const mongoose = require("mongoose");

const clienteSchema = new mongoose.Schema({
    idCliente: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    dni: { type: String, required: true, unique: true },
    telefono: { type: String, required: true },
    email: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Cliente", clienteSchema);
