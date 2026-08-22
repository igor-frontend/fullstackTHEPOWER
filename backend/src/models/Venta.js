const mongoose = require("mongoose");

const ventaSchema = new mongoose.Schema({
    idVenta: { type: String, required: true, unique: true },
    vehiculo: { type: mongoose.Schema.Types.ObjectId, ref: "Vehiculo", required: true },
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: "Cliente", required: true },
    fechaVenta: { type: String, required: true },
    metodoPago: { type: String, required: true }, 
    asesorComercial: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Venta", ventaSchema);
