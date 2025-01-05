import React, { useState } from 'react'
import Loading from '../../loading'
import { useNavigate } from 'react-router-dom';
import { patchMethode } from '../../../utils/apiFetchs';
import { updateUserBlockedRoute } from '../../../utils/apiRoutes';
import Alert from '../../alert';

function BlockedUser({ userSelected, index, users, setUsers }) {
    const navigate = useNavigate();
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
            const response = await patchMethode(`${updateUserBlockedRoute}`, {
                userSelected
            });
            setAlert({
                display: true,
                status: true,
                text: response.data.msg
            });
            const newUser = [...users];
            newUser[index] = response.data.user;
            setUsers(newUser)
        } catch (err) {
            if (err.response.status == 401) {
                return navigate("/admin/authAdmin")
            }
            setAlert({
                display: true,
                status: false,
                text: err.response.data.msg
            });
        } finally {
            setLoading(false);
        }
    }
    return (
        <dialog id="blockedUserModel" className="modal">
            <div className="modal-box">
                <h1 className="font-bold text-lg">{userSelected.isBlocked ? "اعادة تفعيل حساب" : "ايقاف الحساب"}</h1>
                {alert.display && <Alert msg={alert} />}
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn ml-[0.5rem]">اغلاق</button>
                        <button disabled={loading} className="btn btn-primary" onClick={handleSubmit}>{loading ? <Loading /> : 'تحديث'}</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export default BlockedUser