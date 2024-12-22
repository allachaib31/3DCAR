import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../loading';
import { deleteMethode } from '../../../utils/apiFetchs';
import { deleteUserRoute } from '../../../utils/apiRoutes';

function DeleteUser({ setAlert ,deleteUser, setUsers, index}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({
            display: false,
        });
        try {
            const response = await deleteMethode(`${deleteUserRoute}/${deleteUser._id}`);
            setAlert({
                display: true,
                status: true,
                text: response.data.msg
            });
            setUsers((prevItems) => prevItems.filter((_, i) => i !== index));
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
        <dialog id="deleteUser" className="modal">
            <div className="modal-box">
                <h1 className="font-bold text-lg">Delete User</h1>
                <p>Are you sure you want to delete the user?</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn ml-[0.5rem]">Close</button>
                        <button disabled={loading} className="btn btn-primary" onClick={handleSubmit}>{loading ? <Loading /> : 'Delete'}</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export default DeleteUser