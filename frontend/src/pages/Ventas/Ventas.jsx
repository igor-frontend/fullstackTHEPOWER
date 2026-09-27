import { useRef, useState, useContext } from "react";
import useFetch from "../../hooks/useFetch";
import useFormValidation from "../../hooks/useFormValidation";
import { API_BASE_URL } from "../../config/api";
import { AuthContext } from "../../context/AuthContext";
import "./Ventas.css";

const Ventas = () => {
    const { user } = useContext(AuthContext);
    const { data: ventas, refetch } = useFetch(`${API_BASE_URL}/ventas`);
    const { errors, validateFields, clearErrors } = useFormValidation();
    const [serverError, setServerError] = useState(null);

    const idVentaRef = useRef();
    const vinRef = useRef();
    const clienteRef = useRef();
    const pagoRef = useRef();

    const handleRegisterVenta = async (e) => {
        e.preventDefault();
        clearErrors();
        setServerError(null);

        const formRefs = {
            idVenta: idVentaRef,
            vehiculoVin: vinRef,
            clienteId: clienteRef,
            metodoPago: pagoRef
        };

        if (!validateFields(formRefs)) return;

        try {
            const token = localStorage.getItem("concesionario_token");
            const response = await fetch(`${API_BASE_URL}/ventas`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    idVenta: idVentaRef.current.value,
                    vehiculoVin: vinRef.current.value,
                    clienteId: clienteRef.current.value,
                    metodoPago: pagoRef.current.value,
                    fechaVenta: new Date().toLocaleDateString("es-ES"),
                    // CORRECCIÓN SOLICITADA: Uso estricto de optional chaining y fallback preventivo ante valores null/undefined
                    asesorComercial: user?.username || "Anónimo"
                })
            });

            const resData = await response.json();
            if (!response.ok) throw new Error(resData.message || "Error registrando transacción");

            idVentaRef.current.value = "";
            vinRef.current.value = "";
            clienteRef.current.value = "";
            refetch();
        } catch (err) {
            setServerError(err.message);
        }
    };

    return (
        <div className="main-container sales-dashboard">
            <div className="sales-layout">
                <section className="form-panel-card">
                    <h2>Registrar Operación Comercial</h2>
                    {serverError && <div className="error-msg">{serverError}</div>}
                    <form onSubmit={handleRegisterVenta} className="sales-form">
                        <div className="form-group">
                            <label>Código de Operación (ID Venta)</label>
                            <input type="text" ref={idVentaRef} placeholder="VNT-XXXX" />
                            {errors.idVenta && <span className="input-err">{errors.idVenta}</span>}
                        </div>
                        <div className="form-group">
                            <label>Identificador del Vehículo (VIN)</label>
                            <input type="text" ref={vinRef} placeholder="Código de 17 caracteres" />
                            {errors.vehiculoVin && <span className="input-err">{errors.vehiculoVin}</span>}
                        </div>
                        <div className="form-group">
                            <label>Código del Cliente</label>
                            <input type="text" ref={clienteRef} placeholder="CLI-XXXX" />
                            {errors.clienteId && <span className="input-err">{errors.clienteId}</span>}
                        </div>
                        <div className="form-group">
                            <label>Modalidad Financiera</label>
                            <select ref={pagoRef}>
                                <option value="Contado">Contado</option>
                                <option value="Financiación">Financiación</option>
                                <option value="Leasing">Leasing</option>
                            </select>
                        </div>
                        <button type="submit" className="core-btn btn-accent">Cerrar Venta</button>
                    </form>
                </section>
                <section className="table-panel-card">
                    <h2>Historial de Transacciones Cruzadas ({ventas ? ventas.length : 0})</h2>
                    <div className="table-overflow-wrapper">
                        <table className="sales-table">
                            <thead>
                                <tr>
                                    <th>ID Venta</th>
                                    <th>Vehículo</th>
                                    <th>Comprador</th>
                                    <th>Método</th>
                                    <th>Asesor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas && ventas.map(v => (
                                    <tr key={v._id}>
                                        <td><strong>{v.idVenta}</strong></td>
                                        <td>{v.vehiculo?.marca} {v.vehiculo?.modelo} <br/><small>{v.vehiculo?.vin}</small></td>
                                        <td>{v.cliente?.nombre} <br/><small>{v.cliente?.dni}</small></td>
                                        <td>{v.metodoPago}</td>
                                        <td><code>{v.asesorComercial}</code></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Ventas;
