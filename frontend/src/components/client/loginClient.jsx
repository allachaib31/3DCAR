import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getMethode, postMethode } from "../../utils/apiFetchs";
import { authClientRoute, isValidateTokenRouteClient } from "../../utils/apiRoutes";
import LoadingScreen from "../loadingScreen";
import Loading from "../loading";
import Alert from "../alert";

const SubscriptionCard = ({ title, price, discountedPrice, features, discount }) => (
    <div className="max-w-md w-full bg-white shadow-lg rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-3xl font-bold text-black mt-4">
            {discountedPrice ? (
                <>
                    <span className="line-through text-gray-400">{price}</span> {discountedPrice}
                </>
            ) : (
                price
            )}
        </p>
        {discount && <p className="text-sm text-green-600 mt-1">{discount}</p>}
        <ul className="mt-6 space-y-3 text-gray-600">
            {features.map((feature, index) => (
                <li key={index}>{feature}</li>
            ))}
        </ul>
        <a href="https://wa.me/966543674837" target="_blank" className="btn btn-primary">
            اشترك الآن
        </a>
    </div>
);

function LoginClient() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ display: false });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setAlert({ display: false });

        try {
            const response = await postMethode(authClientRoute, { email, password });
            setAlert({ display: true, status: true, text: response.data.msg });
            navigate("/");
        } catch (err) {
            setAlert({ display: true, status: false, text: err.response?.data?.msg || "An error occurred." });
        } finally {
            setLoading(false);
        }
    };

    const validateToken = useCallback(async () => {
        setLoading(true);
        try {
            await getMethode(isValidateTokenRouteClient, true);
            navigate("/");
        } catch (error) {
            console.error("Error validating token");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        validateToken();
    }, [validateToken]);

    return (
        <LoadingScreen
            loading={loading}
            component={
                <div className="min-h-screen bg-base-200 flex items-center justify-center w-full">
                    <div className="w-full flex flex-col lg:flex-row items-center justify-around gap-8 p-4">
                        {/* Subscription Plans */}
                        <div className="flex flex-col md:flex-row gap-6">
                            <SubscriptionCard
                                title="اشتراك شهري"
                                price="149 ريال"
                                features={[
                                    "رؤية السيارة بزاوية 360 درجة",
                                    "اختيار الدرجة المناسبة للسيارة",
                                    "إلغاء الطرق التقليدية لاختيار العازل الحراري",
                                    "نسخة سحابية للبرنامج",
                                    "الدعم الفني والمتابعة خلال العام",
                                    "عدد لا محدود للتجربة",
                                ]}
                            />
                            <SubscriptionCard
                                title="اشتراك سنوي"
                                price="2330 ريال"
                                discountedPrice="699 ريال"
                                discount="خصم 60%"
                                features={[
                                    "رؤية السيارة بزاوية 360 درجة",
                                    "اختيار الدرجة المناسبة للسيارة",
                                    "إلغاء الطرق التقليدية لاختيار العازل الحراري",
                                    "نسخة سحابية للبرنامج",
                                    "الدعم الفني والمتابعة خلال العام",
                                    "عدد لا محدود للتجربة",
                                ]}
                            />
                        </div>

                        {/* Login Form */}
                        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                            <form className="card-body" onSubmit={handleSubmit}>
                                <h1 className="text-3xl text-center font-bold">حيالله من جانا</h1>
                                {alert.display && <Alert msg={alert} />}
                                <div className="form-control">
                                    <label htmlFor="email" className="sr-only">
                                        بريد إلكتروني
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="input input-bordered"
                                        placeholder="بريد إلكتروني"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-control">
                                    <label htmlFor="password" className="sr-only">
                                        كلمة المرور
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        className="input input-bordered"
                                        placeholder="كلمة المرور"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button
                                    className="btn btn-primary w-full"
                                    type="submit"
                                    disabled={loading}
                                    aria-busy={loading}
                                    aria-label="تسجيل الدخول"
                                >
                                    {loading ? <Loading /> : "تسجيل الدخول"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            }
        />
    );
}

export default LoginClient;
