import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { getMethode } from '../../utils/apiFetchs';
import { getAdminsRoute } from '../../utils/apiRoutes';
import LoadingScreen from '../loadingScreen';
import AddAdmin from './modal/addAdmin';
import Alert from '../alert';
import DeleteAdmin from './modal/deleteAdmin';

function AdminSection() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [admins, setAdmins] = useState(false);
    const [deleteAdmin, setDeleteAdmin] = useState(false);
    const [index, setIndex] = useState(false);
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
        getMethode(getAdminsRoute).then((response) => {
            setAdmins(response.data);
        }).catch((err) => {
            if (err.response.status == 500) {
                setAlert({
                    display: true,
                    status: false,
                    text: err.response.data.msg
                });
            }
            if (err.response.status == 401 || err.response.status == 403) {
                navigate("/admin/authAdmin")
            }
        }).finally(() => {
            setLoading(false);
        })
    }, []);
    return (
        <div>
            <div className='flex sm:flex-row flex-col gap-[1rem] justify-between'>
                <button className='btn btn-primary shadow-sm
           shadow-gray-400' onClick={() => document.getElementById('addAdmin').showModal()}>Add admin</button>
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody className='text-[1rem]'>
                            {/* row 1 */}
                            {
                                admins && admins.map((admin, index) => {
                                    return (
                                        <tr key={admin._id}>
                                            <th>{admin.id}</th>
                                            <td>{admin.name}</td>
                                            <td>{admin.username}</td>
                                            <td>{admin.email}</td>
                                            <td><button className='btn btn-error' onClick={() => {
                                                setDeleteAdmin(admin);
                                                setIndex(index);
                                                document.getElementById('deleteAdmin').showModal();
                                            }}>Delete</button></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>

                    </table>
                </div>
            } />
            <AddAdmin setAlert={setAlert} setAdmins={setAdmins}/>
            <DeleteAdmin setAlert={setAlert} deleteAdmin={deleteAdmin} setAdmins={setAdmins} index={index}/>
        </div>
    )
}

export default AdminSection