import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMethode } from '../../utils/apiFetchs';
import { getUsersRoute } from '../../utils/apiRoutes';
import LoadingScreen from '../loadingScreen';
import Alert from '../alert';
import AddUser from './modal/addUser';
import DeleteUser from './modal/deleteUser';
import RenewSubscription from './modal/renewSubscription';
import UploadImageModal from './modal/uploadImageModal';

function UserSection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(false);
  const [userSelected, setUserSelected] = useState("");
  const [deleteUser, setDeleteUser] = useState(false);
  const [index, setIndex] = useState(false);
  const [alert, setAlert] = useState({
    display: false,
  });

  useEffect(() => {
    setLoading(true);
    setAlert({
      display: false,
    });
    getMethode(getUsersRoute).then((response) => {
      setUsers(response.data);
    }).catch((err) => {
      if (err.response.status === 500) {
        setAlert({
          display: true,
          status: false,
          text: err.response.data.msg,
        });
      }
      if (err.response.status === 401 || err.response.status === 403) {
        navigate("/admin/authAdmin");
      }
    }).finally(() => {
      setLoading(false);
    });
  }, []);


  return (
    <div>
      <div className='flex sm:flex-row flex-col gap-[1rem] justify-between'>
        <button className='btn btn-primary shadow-sm shadow-gray-400' onClick={() => document.getElementById('addUser').showModal()}>
          إضافة المستخدمين
        </button>
      </div>
      <div className='my-[0.1rem]'>
        {alert.display && <Alert msg={alert} />}
      </div>
      <LoadingScreen loading={loading} component={
        <div className="overflow-x-auto mt-[1rem]">
          <table className="table bg-white xl:w-full w-[700px]">
            <thead>
              <tr className='text-[1rem]'>
                <th>ID</th>
                <th>اسم</th>
                <th>اسم المستخدم</th>
                <th>بريد إلكتروني</th>
                <th>تاريخ انتهاء الاشتراك</th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody className='text-[1rem]'>
              {users && users.map((user, index) => (
                <tr key={user._id}>
                  <th>{user.id}</th>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.subscriptionExpiryDate}</td>
                  <td>
                    <button className='btn btn-success' onClick={() => {
                      setUserSelected(user._id);
                      document.getElementById('RenewSubscription').showModal();
                    }}>تجديد الاشتراك</button>
                  </td>
                  <td>
                    <button className='btn btn-secondary' onClick={() => {
                      setUserSelected(user._id);
                      document.getElementById('uploadImageModal').showModal();
                    }}>تحميل صورة جديدة</button>
                  </td>
                  <td>
                    <button className='btn btn-error' onClick={() => {
                      setDeleteUser(user);
                      setIndex(index);
                      document.getElementById('deleteUser').showModal();
                    }}>الحذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      } />
      <AddUser setAlert={setAlert} setUsers={setUsers} />
      <DeleteUser setAlert={setAlert} deleteUser={deleteUser} setUsers={setUsers} index={index} />
      <RenewSubscription users={users} setUsers={setUsers} userSelected={userSelected} />
      <UploadImageModal userSelected={userSelected}/>
    </div>
  );
}

export default UserSection;
