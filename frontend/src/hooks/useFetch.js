
import { useState, useEffect, useCallback } from "react";

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const executeFetch = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("concesionario_token");
            const headers = token ? { "Authorization": `Bearer ${token}` } : {};
            
            const response = await fetch(url, { headers });
            if (!response.ok) throw new Error(`Fallo de respuesta: ${response.status}`);
            
            const json = await response.json();
            setData(json);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        executeFetch();
    }, [executeFetch]);

    return { data, loading, error, refetch: executeFetch };
};

export default useFetch;
