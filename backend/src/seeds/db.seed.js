const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const dotenv = require("dotenv");

dotenv.config();

const Vehiculo = require("../models/Vehiculo");
const Cliente = require("../models/Cliente");
const Venta = require("../models/Venta");
const connectDB = require("../config/db");

const vehiculosCSV = path.join(__dirname, "../../data/vehiculos.csv");
const clientesCSV = path.join(__dirname, "../../data/clientes.csv");
const ventasCSV = path.join(__dirname, "../../data/ventas.csv");

const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv({
                mapHeaders: ({ header }) => header.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "_")
            }))
            .on("data", (data) => results.push(data))
            .on("end", () => resolve(results))
            .on("error", (error) => reject(error));
    });
};

const runSeed = async () => {
    try {
        await connectDB();
        console.log("Limpiando colecciones previas...");
        await Vehiculo.deleteMany();
        await Cliente.deleteMany();
        await Venta.deleteMany();

        console.log("Procesando archivos CSV...");
        const rawVehiculos = await parseCSV(vehiculosCSV);
        const rawClientes = await parseCSV(clientesCSV);
        const rawVentas = await parseCSV(ventasCSV);
        const vehiculosMapeados = rawVehiculos.map((v, index) => {
            const keys = Object.keys(v);
            const findValue = (patterns) => {
                const key = keys.find(k => patterns.some(p => k.includes(p)));
                return key ? v[key] : null;
            };

            const vinDetectado = v["numero_de_identificacion_del_vehiculo_(vin)"] || v.vin;
            const precioDetectado = v.precio_de_venta || v.precio;
            const anioDetectado = v.año_de_fabricacion || v.ano_de_fabricacion || v.anio;
            const imagenDetectada = v.imagen;

            return {
                vin: vinDetectado ? vinDetectado.trim().toUpperCase().substring(0, 17) : `VIN-AUTOGEN-${index}`,
                marca: v.marca || "Genérica",
                modelo: v.modelo || "Estándar",
                tipo: v.tipo_de_vehiculo || v.tipo || "Turismo",
                anio: parseInt(anioDetectado) || 2024,
                kilometraje: v.kilometraje || "0 km",
                estado: v.estado || "Nuevo",
                precio: precioDetectado ? precioDetectado.trim() : "25.000 €",
                fechaAdquisicion: v.fecha_de_adquisicion || new Date().toLocaleDateString("es-ES"),
                disponibilidad: v.disponibilidad || "Disponible",
                imagen: imagenDetectada ? imagenDetectada.trim() : "https://unsplash.com",
                color: v.color || "Blanco"
            };
        });
        const vehiculosGuardados = await Vehiculo.insertMany(vehiculosMapeados);
        console.log(`✅ ${vehiculosGuardados.length} Vehículos inyectados.`);
        const clientesMapeados = rawClientes.map((c, index) => {
            const idDetectado = c.id_cliente || c.id || `CLI-${index + 1}`;
            const nombreDetectado = c.nombre_del_cliente || c.nombre || "Cliente Anónimo";
            
            return {
                idCliente: idDetectado.trim().toUpperCase(),
                nombre: nombreDetectado.trim(),
                dni: `47382${index}23X`,
                telefono: `6001230${index}`,
                email: c.email ? c.email.trim() : `usuario${index}@concesionario.com`
            };
        });
        const clientesGuardados = await Cliente.insertMany(clientesMapeados);
        console.log(`✅ ${clientesGuardados.length} Clientes inyectados.`);

        const vehiculoMap = new Map(vehiculosGuardados.map(v => [v.vin, v._id]));
        const clienteMap = new Map(clientesGuardados.map(c => [c.idCliente, c._id]));
                const ventasMapeadas = rawVentas.map((v, index) => {
                    const vehiculoVin = (v.vehiculo_vendido || "").trim().toUpperCase();
                    const clienteId = (v.cliente_asociado || "").trim().toUpperCase();
        
                    const vehiculoIdReal = vehiculoMap.get(vehiculoVin) || vehiculosGuardados[index % vehiculosGuardados.length]._id;
                    const clienteIdReal = clienteMap.get(clienteId) || clientesGuardados[index % clientesGuardados.length]._id;
                    const metodoReal = v.metodo_de_pago ? v.metodo_de_pago.trim() : "Transacción bancaria";
        
                    const listadoAsesores = ["Carlos Mendoza", "Ana Martínez", "Pedro Gila", "Laura Beltrán", "Roberto Soriano"];
                    const asesorReal = listadoAsesores[index % listadoAsesores.length];
        
                    return {
                        idVenta: v.id_venta || `VNT-0${index + 1}`,
                        vehiculo: vehiculoIdReal,
                        cliente: clienteIdReal,
                        fechaVenta: v.fecha_de_venta || new Date().toLocaleDateString("es-ES"),
                        metodoPago: metodoReal,
                        asesorComercial: asesorReal
                    };
                });
        
        
        const ventasGuardadas = await Venta.insertMany(ventasMapeadas);
        console.log(`✅ ${ventasGuardadas.length} Ventas cruzadas inyectadas.`);
        
        console.log("🚀 ¡Semilla masiva Fullstack inyectada con éxito total!");
        process.exit(0);
    } catch (error) {
        console.error("Fallo crítico en el proceso de la semilla:", error);
        process.exit(1);
    }
};

runSeed();