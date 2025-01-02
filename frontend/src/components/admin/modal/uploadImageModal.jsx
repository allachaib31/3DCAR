import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { patchMethode } from '../../../utils/apiFetchs';
import { uploadImageRoute } from '../../../utils/apiRoutes';
import Loading from '../../loading';
import Alert from '../../alert';

function UploadImageModal({userSelected}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState(null); // New state for file upload
    const [alert, setAlert] = useState({
        display: false,
    });

    const handleFileUpload = (userId) => {
        if (!file) {
            setAlert({
                display: true,
                status: false,
                text: "الرجاء اختيار صورة للتحميل",
            });
            return;
        }

        const formData = new FormData();
        formData.append("image", file);
        formData.append("userId", userId);

        setLoading(true);
        patchMethode(uploadImageRoute, formData)
            .then(() => {
                setAlert({
                    display: true,
                    status: true,
                    text: "تم تحميل الصورة بنجاح",
                });
                setFile(null); // Reset file input
            })
            .catch((err) => {
                setAlert({
                    display: true,
                    status: false,
                    text: err.response?.data?.msg || "حدث خطأ أثناء تحميل الصورة",
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };
    return (
        <dialog id="uploadImageModal" className="modal">
            <form method="dialog" className="modal-box">
                <h3 className="font-bold text-lg">تحميل صورة جديدة</h3>
                <hr />
                {alert.display && <Alert msg={alert} />}
                <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="file-input file-input-bordered w-full mt-4" />
                <div className="modal-action">
                    <button className="btn ml-[0.5rem]">إلغاء</button>
                    <button className="btn btn-primary" disabled={loading} onClick={() => handleFileUpload(userSelected)}>{loading ? <Loading /> : "تحميل"}</button>
                </div>
            </form>
        </dialog>
    )
}

export default UploadImageModal