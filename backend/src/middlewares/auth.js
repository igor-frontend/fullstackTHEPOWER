const jwt = require("jsonwebtoken");
const User = require("../models/User");

const isAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No autenticado. Falta el token" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "clave_secreta_por_defecto");

        const user = await User.findById(decoded.id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "Usuario no encontrado" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({ message: "Acceso denegado. Permisos insuficientes" });
        }
    };
};

module.exports = { isAuth, checkRole };