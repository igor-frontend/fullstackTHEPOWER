const mongoose = require("mongoose");

const vehiculoSchema = new mongoose.Schema({
    vin: { type: String, required: true, unique: true },
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    tipo: { type: String, default: "Turismo" },
    anio: { type: Number, required: true },
    kilometraje: { type: String, required: true },
    estado: { type: String, enum: ["Nuevo", "Usado"], required: true },
    precio: { type: String, required: true },
    fechaAdquisicion: { type: String, required: true },
    disponibilidad: { type: String, enum: ["Disponible", "Reservado", "Vendido"], default: "Disponible" },
    imagen: { type: String },
    color: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Vehiculo", vehiculoSchema);
