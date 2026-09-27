import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
    const { user, logoutUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logoutUser();
        navigate("/login");
    };

    return (
        <nav className="navbar-enterprise">
            <div className="navbar-container-fluid">
                <div className="nav-left-block">
                    <button onClick={() => navigate("/")} className="nav-logo-btn">
                        Concesionarios Igor
                    </button>
                    <button onClick={() => navigate("/")} className="nav-link-btn">
                        Stock
                    </button>
                    <button onClick={() => navigate("/ventas")} className="nav-link-btn">
                        Operaciones Comerciales
                    </button>
                </div>
                <div className="nav-right-block">
                    {user ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <span className="user-profile-badge">
                                👤 {user.username} ({user.role})
                            </span>
                            <button onClick={handleLogout} className="core-btn btn-logout-nav">
                                Salir
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => navigate("/login")} className="core-btn btn-accent nav-login-action">
                            Entrar
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;