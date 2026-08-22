
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import { API_BASE_URL } from "../../config/api";
import "./Home.css";

const Home = () => {
    const { data: vehiculos, loading, error } = useFetch(`${API_BASE_URL}/vehiculos`);
    const [filtroMarca, setFiltroMarca] = useState("");

    if (loading) return <div className="loading-msg">Cargando flota automotriz del concesionario...</div>;
    if (error) return <div className="main-container"><div className="error-msg">Error de conexión: {error}</div></div>;

    const cochesFiltrados = vehiculos.filter(c => 
        (c.marca && c.marca.toLowerCase().includes(filtroMarca.toLowerCase())) ||
        (c.modelo && c.modelo.toLowerCase().includes(filtroMarca.toLowerCase()))
    );

    return (
        <div className="main-container">
            <header className="home-dashboard-header">
                <div>
                    <h1>Gestión de Stock de Vehículos</h1>
                    <p>Catálogo centralizado extraído dinámicamente desde semilla de datos</p>
                </div>
                <input 
                    type="search" 
                    placeholder="Filtrar por marca o modelo (ej: Toyota)..." 
                    className="search-dashboard-input"
                    value={filtroMarca}
                    onChange={(e) => setFiltroMarca(e.target.value)}
                />
            </header>

            <div className="vehicles-grid-layout">
                {cochesFiltrados.map((coche) => (
                    <article key={coche._id} className="vehicle-dashboard-card">
                        <div className="card-media-wrapper">
                            <img src={coche.imagen} alt={`${coche.marca} ${coche.modelo}`} className="vehicle-card-img" />
                            <span className={`status-badge-tag ${coche.disponibilidad ? coche.disponibilidad.toLowerCase() : "disponible"}`}>
                                {coche.disponibilidad || "Disponible"}
                            </span>
                        </div>
                        <div className="card-info-content">
                            <div className="brand-meta-row">
                                <h3>{coche.marca} <span className="model-span">{coche.modelo}</span></h3>
                                <span className="year-label">{coche.anio}</span>
                            </div>
                            <p className="vin-text">VIN: <code>{coche.vin}</code></p>
                            <div className="specs-row-info">
                                <span>Año: {coche.anio}</span>
                                <span>✨ {coche.estado}</span>
                            </div>
                            <div className="price-row-footer">
                                <span className="price-tag-value">{coche.precio}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default Home;
