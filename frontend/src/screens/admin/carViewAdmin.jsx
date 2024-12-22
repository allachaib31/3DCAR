import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getMethode } from '../../utils/apiFetchs';
import { isValidateTokenRoute } from '../../utils/apiRoutes';

function CarViewAdmin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true)
        const validateToken = async () => {
            try {
                const response = await getMethode(isValidateTokenRoute);
            } catch (error) {
                navigate("/admin/authAdmin");

            } finally {
                setLoading(false);
            }
        };

        validateToken(); // Call the async function
    }, []);
    return (
        <div>
            <Outlet />
        </div>
    )
}

export default CarViewAdmin