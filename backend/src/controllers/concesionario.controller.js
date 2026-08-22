const Vehiculo = require("../models/Vehiculo");
const Cliente = require("../models/Cliente");
const Venta = require("../models/Venta");

const getVehiculos = async (req, res) => {
    try {
        const vehiculos = await Vehiculo.find();
        res.status(200).json(vehiculos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener vehículos", error: error.message });
    }
};

const getClientes = async (req, res) => {
    try {
        const clientes = await Cliente.find();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener clientes", error: error.message });
    }
};

const getVentas = async (req, res) => {
    try {
        const ventas = await Venta.find().populate("vehiculo").populate("cliente");
        res.status(200).json(ventas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener ventas", error: error.message });
    }
};

const createVenta = async (req, res) => {
    try {
        const { idVenta, vehiculoVin, clienteId, fechaVenta, metodoPago, asesorComercial } = req.body;
        const limpioVin = vehiculoVin ? vehiculoVin.trim().toUpperCase() : "";
        const limpioCliente = clienteId ? clienteId.trim() : "";
        const vehiculoObj = await Vehiculo.findOne({ vin: limpioVin });
        const clienteObj = await Cliente.findOne({
            $or: [
                { idCliente: limpioCliente.toUpperCase() },
                { dni: limpioCliente },
                { nombre: { $regex: limpioCliente, $options: "i" } }
            ]
        });

        if (!vehiculoObj || !clienteObj) {
            return res.status(444).json({ message: "Vehículo o Cliente no encontrado con las claves aportadas" });
        }

        if (vehiculoObj.disponibilidad === "Vendido") {
            return res.status(400).json({ message: "El vehículo ya ha sido vendido" });
        }

        const nuevaVenta = await Venta.create({
            idVenta: idVenta ? idVenta.trim() : `VNT-${Date.now()}`,
            vehiculo: vehiculoObj._id,
            cliente: clienteObj._id,
            fechaVenta: fechaVenta || new Date().toLocaleDateString("es-ES"),
            metodoPago: metodoPago || "Transacción bancaria",
            asesorComercial: asesorComercial || "Asesor General"
        });
        vehiculoObj.disponibilidad = "Vendido";
        await vehiculoObj.save();

        res.status(201).json(nuevaVenta);
    } catch (error) {
        res.status(500).json({ message: "Error al procesar la venta", error: error.message });
    }
};

module.exports = { 
    getVehiculos, 
    getClientes, 
    getVentas, 
    createVenta 
};