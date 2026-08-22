import { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api";
import { AuthContext } from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errorForm, setErrorForm] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    
    const { loginUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        setErrorForm(null);
        setSubmitting(true);

        const email = emailRef.current.value.trim();
        const password = passwordRef.current.value;

        if (!email || !password) {
            setErrorForm("Por favor, rellene todos los campos obligatorios.");
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message || "Fallo en la autenticación");
            loginUser(data.user, data.token);
            navigate("/ventas");
        } catch (err) {
            setErrorForm(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="login-page-wrapper">
            <div className="login-card-box">
                <h2>Acceso de Asesores</h2>
                <p className="login-card-subtitle">Introduce tus credenciales del concesionario</p>
                
                {errorForm && <div className="error-msg">{errorForm}</div>}
                
                <form onSubmit={handleLoginSubmit} className="login-core-form">
                    <div className="form-group">
                        <label htmlFor="email">Correo Corporativo</label>
                        <input type="email" id="email" ref={emailRef} placeholder="ejemplo@school.com" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Contraseña de Acceso</label>
                        <input type="password" id="password" ref={passwordRef} placeholder="••••••••" />
                    </div>
                    <button type="submit" disabled={submitting} className="core-btn btn-accent login-btn-block">
                        {submitting ? "Verificando..." : "Iniciar Sesión"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
