import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/auth/register`,
                formData
            );
            setMessage(response.data.message);
            setFormData({ name: "", email: "", password: "" });
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred during registration");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
                
                {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
                {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
                
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onChange={handleChange}
                            value={formData.name}
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2 font-medium">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a password"
                            required
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                
                <div className="mt-6 text-center text-gray-600">
                    Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Login here</Link>
                </div>
            </div>
        </div>
    );
}

export default Register;