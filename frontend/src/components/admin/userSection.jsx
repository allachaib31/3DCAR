import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getMethode } from '../../utils/apiFetchs';
import { getUsersRoute } from '../../utils/apiRoutes';
import LoadingScreen from '../loadingScreen';
import Alert from '../alert';
import AddUser from './modal/addUser';

function UserSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(false);
  const [alert, setAlert] = useState({
    display: false,
  });


  /*const handleAction = (id, admin, index) => {
      setUpdateAdmin({
          id: admin._id,
          name: admin.name,
          username: admin.username,
          email: admin.email,
      });
      setIndexAdmin(index);
      setUpdatePassword({
          id: admin._id,
          currentPassword: "",
          newPassword: ""
      });
      setStopAccount({
          id: admin._id,
          block: !admin.isBlocked
      });
      document.getElementById(id).showModal();
  }*/
  useEffect(() => {
    setLoading(true);
    setAlert({
      display: false,
    });
    getMethode(getUsersRoute).then((response) => {
      setUsers(response.data);
    }).catch((err) => {
      if (err.response.status == 500) {
        setAlert({
          display: true,
          status: false,
          text: err.response.data.msg
        });
      }
      if (err.response.status == 401 || err.response.status == 403) {
        navigate("/authAdmin")
      }
    }).finally(() => {
      setLoading(false);
    })
  }, []);
  return (
    <div>
      <div className='flex sm:flex-row flex-col gap-[1rem] justify-between'>
        <button className='btn btn-primary shadow-sm
         shadow-gray-400' onClick={() => document.getElementById('addUser').showModal()}>Add Users</button>
      </div>
      <div className='my-[0.1rem]'>
        {alert.display && <Alert msg={alert} />}
      </div>
      <LoadingScreen loading={loading} component={
        <div className="overflow-x-auto mt-[1rem]">
          <table className="table bg-white xl:w-full w-[700px]">
            {/* head */}
            <thead>
              <tr className='text-[1rem]'>
                <th>ID</th>
                <th>Name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Subscription Expiry Date</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody className='text-[1rem]'>
              {/* row 1 */}
              {
                users && users.map((user, index) => {
                  return (
                    <tr key={user._id}>
                      <th>{user.id}</th>
                      <td>{user.name}</td>
                      <td>{user.username}</td>
                      <td>{user.email}</td>
                      <td>{user.subscriptionExpiryDate}</td>
                      <td><button className='btn btn-success'>Renew subscription</button></td>
                      <td><button className='btn btn-error'>Delete user</button></td>
                    </tr>
                  )
                })
              }
            </tbody>

          </table>
        </div>
      } />
      <AddUser setAlert={setAlert} setUsers={setUsers} />

    </div>
  )
}

export default UserSection