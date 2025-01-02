import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Loading from '../../loading';
import { patchMethode } from '../../../utils/apiFetchs';
import { renewSubscriptionRoute } from '../../../utils/apiRoutes';
import Alert from '../../alert';

function RenewSubscription({ users ,setUsers ,userSelected}) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [subscriptionDate, setSubscriptionDate] = useState("");
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
            const response = await patchMethode(`${renewSubscriptionRoute}`, {
                idUser: userSelected,
                subscriptionDate: subscriptionDate
            });
            setAlert({
                display: true,
                status: true,
                text: response.data.msg
            });
            const newUser = [...users];
            for (let i = 0; i < newUser.length; i++) {
                if(newUser[i]._id.toString() == userSelected.toString()){
                    newUser[i].subscriptionExpiryDate = response.data.subscriptionDate;
                    break;
                }
                
            }
            setUsers(newUser);
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
        <dialog id="RenewSubscription" className="modal">
            <div className="modal-box">
                <h1 className="font-bold text-lg">تجديد الاشتراك</h1>
                {alert.display && <Alert msg={alert} />}
                <input type="date" className="input input-bordered w-full max-w-xs" onChange={(event) => setSubscriptionDate(event.target.value)}/>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn ml-[0.5rem]">اغلاق</button>
                        <button disabled={loading} className='btn btn-primary' onClick={handleSubmit}>{loading ? <Loading /> : 'ارسال'}</button>
                    </form>
                </div>
            </div>
        </dialog>
    )
}

export default RenewSubscription