import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { getMethode } from '../../utils/apiFetchs';
import { isValidateTokenRouteClient } from '../../utils/apiRoutes';

function CarViewClient() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true)
        const validateToken = async () => {
            try {
                const response = await getMethode(isValidateTokenRouteClient, true);
            } catch (error) {
                console.log(error)
                navigate("/authClient");

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

export default CarViewClient