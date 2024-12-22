import React, {  useState } from 'react'
import { useNavigate } from 'react-router-dom';
import {  addUserRoute } from '../../../utils/apiRoutes';
import { postMethode } from '../../../utils/apiFetchs';
import Loading from '../../loading';

function AddUser({ setAlert ,setUsers}) {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        subscriptionExpiryDate: ""
    })
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({
            display: false,
        });
        try {
            const response = await postMethode(addUserRoute, inputs);
            setAlert({
                display: true,
                status: true,
                text: response.data.msg
            });
            setUsers((prev) => [...prev, response.data.newUser])
        } catch (err) {
            if (err.response.status == 401 || err.response.status == 403) {
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
        <dialog id="addUser" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-[0.5rem]">Add User</h3>
                <hr />
                <form className='flex flex-col gap-[1rem] mt-[1rem]'>
                    <label className="input input-bordered flex items-center gap-2">
                        Name
                        <input type="text" className="grow" onChange={(event) => {
                            setInputs((prevInputs) => {
                                return {
                                    ...prevInputs,
                                    name: event.target.value
                                }
                            })
                        }} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        Username
                        <input type="text" className="grow" onChange={(event) => {
                            setInputs((prevInputs) => {
                                return {
                                    ...prevInputs,
                                    username: event.target.value
                                }
                            })
                        }} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        Email
                        <input type="email" className="grow" onChange={(event) => {
                            setInputs((prevInputs) => {
                                return {
                                    ...prevInputs,
                                    email: event.target.value
                                }
                            })
                        }} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        Password
                        <input type="password" className="grow" onChange={(event) => {
                            setInputs((prevInputs) => {
                                return {
                                    ...prevInputs,
                                    password: event.target.value
                                }
                            })
                        }} />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                    Subscription Expiry Date
                        <input type="date" className="grow" onChange={(event) => {
                            setInputs((prevInputs) => {
                                return {
                                    ...prevInputs,
                                    subscriptionExpiryDate: event.target.value
                                }
                            })
                        }} />
                    </label>
                </form>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn ml-[0.5rem]">Close</button>
                        <button disabled={loading} className='btn btn-primary' onClick={handleSubmit}>{loading ? <Loading /> : 'Submit'}</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export default AddUser