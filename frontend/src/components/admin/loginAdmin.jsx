import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../loading';
import { authAdminRoute, isValidateTokenRoute } from '../../utils/apiRoutes';
import Alert from '../alert';
import { getMethode, postMethode } from '../../utils/apiFetchs';
import LoadingScreen from '../loadingScreen';

function LoginAdmin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        display: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({
            display: false,
        });

        try {
            const response = await postMethode(authAdminRoute, { email, password });
            setAlert({
                display: true,
                status: true,
                text: response.data.msg
            });
            navigate("/");
        } catch (err) {
            setAlert({
                display: true,
                status: false,
                text: err.response.data.msg
            });
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        setLoading(true)
        const validateToken = async () => {
            try {
                const response = await getMethode(isValidateTokenRoute);

                navigate("/");

            } catch (error) {
                console.error('Error validating token');
            } finally {
                setLoading(false);
            }
        };

        validateToken(); // Call the async function
    }, [navigate]);
    return (
        <LoadingScreen loading={loading} component={
            <div>
                <form onSubmit={handleSubmit}>
                    <h1 className='text-3xl text-center font-bold'>Welcome Admin</h1>
                    {alert.display && <Alert msg={alert} />} {/* Display error message */}
                    <label className="input input-bordered flex items-center gap-2 my-[1rem]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                            <path
                                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                        </svg>
                        <input
                            type="text"
                            className="grow"
                            placeholder="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} // Update email state
                            required
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2 mb-[1rem]">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd" />
                        </svg>
                        <input
                            type="password"
                            placeholder='password'
                            className="grow"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button className='btn btn-primary w-full' type="submit" disabled={loading}>
                        {loading ? <Loading /> : 'login'}
                    </button>
                </form>
            </div>
        } />
    );
}

export default LoginAdmin;
