const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const { register, login } = require("./controllers/user.controller");


const { 
    getVehiculos, 
    getClientes, 
    getVentas, 
    createVenta 
} = require("./controllers/concesionario.controller");

const { isAuth, checkRole } = require("./middlewares/auth");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

app.get("/api/vehiculos", getVehiculos);

app.get("/api/clientes", isAuth, checkRole(["asesor", "admin"]), getClientes);
app.get("/api/ventas", isAuth, checkRole(["asesor", "admin"]), getVentas);
app.post("/api/ventas", isAuth, checkRole(["asesor", "admin"]), createVenta);

const PORT = process.env.PORT || 3030;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor de Concesionario corriendo en el puerto ${PORT}`);
    });
});