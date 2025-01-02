import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../loading';
import { deleteMethode } from '../../../utils/apiFetchs';
import { deleteAdminRoute } from '../../../utils/apiRoutes';

function DeleteAdmin({ setAlert ,deleteAdmin, setAdmins, index}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({
            display: false,
        });
        try {
            const response = await deleteMethode(`${deleteAdminRoute}/${deleteAdmin._id}`);
            setAlert({
                display: true,
                status: true,
                text: response.data.msg
            });
            setAdmins((prevItems) => prevItems.filter((_, i) => i !== index));
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
        <dialog id="deleteAdmin" className="modal">
            <div className="modal-box">
                <h1 className="font-bold text-lg">حذف المسؤول</h1>
                <p>هل أنت متأكد أنك تريد حذف المسؤول؟</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn ml-[0.5rem]">اغلاق</button>
                        <button disabled={loading} className="btn btn-primary" onClick={handleSubmit}>{loading ? <Loading /> : 'الحذف'}</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export default DeleteAdmin