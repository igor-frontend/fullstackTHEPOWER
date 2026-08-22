import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import Ventas from "./pages/Ventas/Ventas";
import Login from "./pages/Login/Login";
import "./index.css";

const AppLayout = () => {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/ventas" element={<Ventas />} />
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