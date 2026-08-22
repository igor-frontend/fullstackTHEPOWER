
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("concesionario_token");
        const storedUser = localStorage.getItem("concesionario_user");
        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const loginUser = (userData, token) => {
        localStorage.setItem("concesionario_token", token);
        localStorage.setItem("concesionario_user", JSON.stringify(userData));
        setUser(userData);
    };

    const logoutUser = () => {
        localStorage.removeItem("concesionario_token");
        localStorage.removeItem("concesionario_user");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
