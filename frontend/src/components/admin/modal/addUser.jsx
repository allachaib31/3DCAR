import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addUserRoute } from '../../../utils/apiRoutes';
import { postMethode } from '../../../utils/apiFetchs';
import Loading from '../../loading';

function AddUser({ setAlert, setUsers }) {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
        subscriptionExpiryDate: "",
    });
    const [image, setImage] = useState(null); // State for the uploaded image
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({
            display: false,
        });

        // Create a FormData object to handle file upload
        const formData = new FormData();
        Object.keys(inputs).forEach((key) => formData.append(key, inputs[key]));
        if (image) formData.append("image", image);

        try {
            const response = await postMethode(addUserRoute, formData);
            setAlert({
                display: true,
                status: true,
                text: response.data.msg,
            });
            setUsers((prev) => [...prev, response.data.newUser]);
        } catch (err) {
            if (err.response?.status === 401 || err.response?.status === 403) {
                return navigate("/admin/authAdmin");
            }
            setAlert({
                display: true,
                status: false,
                text: err.response?.data?.msg,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id="addUser" className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg mb-[0.5rem]">إضافة مستخدم</h3>
                <hr />
                <form className="flex flex-col gap-[1rem] mt-[1rem]">
                    <label className="input input-bordered flex items-center gap-2">
                        اسم
                        <input
                            type="text"
                            className="grow"
                            onChange={(event) => {
                                setInputs((prevInputs) => ({
                                    ...prevInputs,
                                    name: event.target.value,
                                }));
                            }}
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        اسم المستخدم
                        <input
                            type="text"
                            className="grow"
                            onChange={(event) => {
                                setInputs((prevInputs) => ({
                                    ...prevInputs,
                                    username: event.target.value,
                                }));
                            }}
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        بريد إلكتروني
                        <input
                            type="email"
                            className="grow"
                            onChange={(event) => {
                                setInputs((prevInputs) => ({
                                    ...prevInputs,
                                    email: event.target.value,
                                }));
                            }}
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        كلمة المرور
                        <input
                            type="password"
                            className="grow"
                            onChange={(event) => {
                                setInputs((prevInputs) => ({
                                    ...prevInputs,
                                    password: event.target.value,
                                }));
                            }}
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        تاريخ انتهاء الاشتراك
                        <input
                            type="date"
                            className="grow"
                            onChange={(event) => {
                                setInputs((prevInputs) => ({
                                    ...prevInputs,
                                    subscriptionExpiryDate: event.target.value,
                                }));
                            }}
                        />
                    </label>
                    <label className="input input-bordered flex items-center gap-2">
                        صورة المستخدم
                        <input
                            type="file"
                            accept="image/*"
                            className="grow"
                            onChange={(event) => setImage(event.target.files[0])}
                        />
                    </label>
                </form>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn ml-[0.5rem]">اغلاق</button>
                        <button
                            disabled={loading}
                            className="btn btn-primary"
                            onClick={handleSubmit}
                        >
                            {loading ? <Loading /> : 'ارسال'}
                        </button>
                    </form>
                </div>
            </div>
        </dialog>
    );
}

export default AddUser;
