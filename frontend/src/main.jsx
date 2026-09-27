import { StrictMode, useContext } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Ventas from "./pages/Ventas/Ventas";
import Login from "./pages/Login/Login";
import "./index.css";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    
    if (loading) {
        return <div style={{ padding: "20px", textAlign: "center" }}>Cargando sesión...</div>;
    }
    
    return user ? children : <Navigate to="/login" replace />;
};

const AppLayout = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route 
                    path="/ventas" 
                    element={
                        <PrivateRoute>
                            <Ventas />
                        </PrivateRoute>
                    } 
                />
            </Routes>
        </>
    );
};

const RootApp = () => {
    return (
        <BrowserRouter>
            <AppLayout />
        </BrowserRouter>
    );
};

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <RootApp />
        </AuthProvider>
    </StrictMode>
);