import { useState, useCallback } from "react";

const useFormValidation = (initialState = {}) => {
    const [errors, setErrors] = useState({});

    const validateFields = useCallback((fields) => {
        const currentErrors = {};
        Object.keys(fields).forEach(key => {
            const value = fields[key]?.current ? fields[key].current.value.trim() : fields[key];
            if (!value) {
                currentErrors[key] = "Este campo es de carácter obligatorio para el concesionario.";
            }
        });
        setErrors(currentErrors);
        return Object.keys(currentErrors).length === 0;
    }, []);

    const clearErrors = useCallback(() => setErrors({}), []);

    return { errors, validateFields, clearErrors };
};

export default useFormValidation;
