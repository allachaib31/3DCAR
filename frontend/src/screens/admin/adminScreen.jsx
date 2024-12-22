import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { getMethode } from '../../utils/apiFetchs';
import { isValidateTokenRoute } from '../../utils/apiRoutes';
import LoadingScreen from '../../components/loadingScreen';

function AdminScreen() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true)
    const validateToken = async () => {
      try {
        const response = await getMethode(isValidateTokenRoute);
      } catch (error) {
        navigate("/authAdmin");

      } finally {
        setLoading(false);
      }
    };

    validateToken(); // Call the async function
  }, []);
  return (
    <LoadingScreen loading={loading} component={
      <div className='container mx-auto'>
        <div className="navbar bg-base-100">
          <div className="navbar-start">
            <div className="dropdown">
              <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16" />
                </svg>
              </div>
              <ul
                tabIndex={0}
                className="menu text-[1rem] menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                <li><Link to="/admin">Admins</Link></li>
                <li>
                  <Link to="/admin/users">Users</Link>
                </li>
                <li><a href='/admin/carViewer'>Car showroom</a></li>
              </ul>
            </div>
            <a className="btn btn-ghost text-[3rem]">cars3D</a>
          </div>
          <div className="navbar-center hidden lg:flex">
            <ul className="menu text-[1rem] menu-horizontal px-1">
              <li><Link to="/admin">Admins</Link></li>
              <li>
                <Link to="/admin/users">Users</Link>
              </li>
              <li><Link to='/admin/carViewer'>Car showroom</Link></li>
            </ul>
          </div>
          <div className="navbar-end">
            <a className="btn" onClick={() => {
              window.localStorage.removeItem("token");
              navigate("/admin/authAdmin")
            }}>Logout</a>
          </div>
        </div>
        <Outlet />
      </div>
    } />
  )
}

export default AdminScreen