import React, { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { getMethode } from '../../utils/apiFetchs';
import { isValidateTokenRoute } from '../../utils/apiRoutes';

function CarViewAdmin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(false);
    useEffect(() => {
        setLoading(true)
        const validateToken = async () => {
            try {
                const response = await getMethode(isValidateTokenRoute);
                setUser(response.data.admin);
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
            <Outlet context={{user}}/>
        </div>
    )
}

export default CarViewAdmin