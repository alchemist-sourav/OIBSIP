import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function VerifyEmail() {
    const { token } = useParams();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verify = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/verify-email/${token}`);
                setMessage(response.data.message);
            } catch (err) {
                setError(err.response?.data?.message || "Verification failed");
            }
            setLoading(false);
        };
        verify();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Email Verification</h2>
                {loading ? (
                    <p className="text-gray-600">Verifying your email, please wait...</p>
                ) : (
                    <>
                        {message && (
                            <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                                <p className="font-semibold">{message}</p>
                            </div>
                        )}
                        {error && (
                            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                                <p className="font-semibold">{error}</p>
                            </div>
                        )}
                        <Link to="/login" className="inline-block bg-blue-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-blue-600 transition">
                            Go to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

export default VerifyEmail;
