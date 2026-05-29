import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/auth/login`,
                formData
            );
            localStorage.setItem("token", response.data.token);
            if (response.data.user && response.data.user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-br from-[#0a0a0a] via-[#111316] to-[#1a1d24] text-white font-sans selection:bg-green-500/30">
            {/* Left Side: Image and Text */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="z-10 text-center max-w-md mt-10 relative">
                    <img 
                        src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80" 
                        alt="Delicious Pizza" 
                        className="w-full max-w-sm mx-auto object-cover rounded-full shadow-2xl mb-12 border-8 border-[#1a1c1e]/50 hover:scale-105 hover:rotate-3 transition-transform duration-700 ease-out"
                        style={{ filter: 'drop-shadow(0 30px 40px rgba(0,0,0,0.7))' }}
                    />
                    <h1 className="text-5xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-green-100 to-green-500 drop-shadow-sm">
                        Satisfy your<br/>pizza cravings.
                    </h1>
                    <p className="text-gray-400 text-sm leading-relaxed font-light px-4">
                        Experience the finest, wood-fired pizzas delivered straight to your door. Fresh ingredients, authentic recipes, and a taste that brings people together.
                    </p>
                    <div className="flex justify-center mt-10 space-x-3">
                        <div className="w-8 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        <div className="w-3 h-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors cursor-pointer"></div>
                        <div className="w-3 h-1.5 bg-white/20 rounded-full hover:bg-white/40 transition-colors cursor-pointer"></div>
                    </div>
                </div>
            </div>

            {/* Right Side: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10">
                <div className="absolute inset-0 bg-[#0f1011]/40 backdrop-blur-3xl lg:hidden -z-10"></div>
                
                <div className="absolute top-8 left-8 lg:hidden">
                    <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tighter drop-shadow-md">Pieza.</h2>
                </div>

                <div className="max-w-md w-full bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 tracking-tighter mb-8 hidden lg:block italic drop-shadow-md">Pieza.</h2>
                        <h1 className="text-3xl font-semibold mb-3 text-white tracking-tight">Welcome Back <span role="img" aria-label="wave" className="inline-block animate-bounce origin-bottom-right" style={{ animationDuration: '2s' }}>👋</span></h1>
                        <p className="text-gray-400 text-sm mt-3 leading-relaxed">Enter your details to access your account.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 text-sm text-center flex items-center justify-center space-x-2 animate-pulse">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-gray-300 text-xs font-medium mb-2 ml-1 uppercase tracking-wider">Email address</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="john.doe@gmail.com"
                                    required
                                    className="w-full bg-black/20 text-white px-5 py-4 rounded-xl border border-white/10 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:bg-black/40 transition-all duration-300 text-sm placeholder-gray-600 shadow-inner"
                                    onChange={handleChange}
                                    value={formData.email}
                                />
                                <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none text-gray-500 group-focus-within:text-green-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-300 text-xs font-medium mb-2 ml-1 uppercase tracking-wider">Password</label>
                            <div className="relative group">
                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    required
                                    className="w-full bg-black/20 text-white px-5 py-4 rounded-xl border border-white/10 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:bg-black/40 transition-all duration-300 text-sm placeholder-gray-600 shadow-inner"
                                    onChange={handleChange}
                                    value={formData.password}
                                />
                                <div className="absolute inset-y-0 right-5 flex items-center cursor-pointer text-gray-500 hover:text-green-400 group-focus-within:text-green-500 transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <label className="flex items-center text-xs text-gray-400 cursor-pointer hover:text-gray-300 transition-colors">
                                <input type="checkbox" className="mr-3 rounded border-white/20 bg-black/20 text-green-500 focus:ring-green-500 focus:ring-offset-0 w-4 h-4 transition-all cursor-pointer" defaultChecked />
                                Remember me
                            </label>
                            <Link to="/forgot-password" className="text-xs text-green-400 hover:text-green-300 hover:underline underline-offset-4 transition-all">Forgot password?</Link>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-4 rounded-xl hover:from-green-400 hover:to-emerald-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none mt-8 text-sm tracking-wide"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center space-x-2">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    <span>Authenticating...</span>
                                </span>
                            ) : "Sign In"}
                        </button>
                    </form>

                    <div className="mt-8 relative flex items-center justify-center">
                        <div className="border-t border-white/10 w-full absolute"></div>
                        <span className="bg-[#15171a] px-4 text-xs text-gray-500 relative z-10 rounded-full border border-white/5">or</span>
                    </div>

                    <div className="mt-8 space-y-4">
                        <button className="w-full flex items-center justify-center space-x-3 bg-white/[0.02] text-gray-300 py-3.5 rounded-xl hover:bg-white/10 transition-all duration-300 border border-white/5 hover:border-white/20 text-xs font-medium hover:-translate-y-0.5 shadow-sm">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 drop-shadow-sm" alt="Google" />
                            <span>Continue with Google</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center text-xs text-gray-400">
                        Don't have an account? <Link to="/register" className="text-green-400 hover:text-green-300 font-semibold hover:underline underline-offset-4 transition-all ml-1">Sign Up</Link>
                    </div>
                </div>
                
                {/* Footer links */}
                <div className="absolute bottom-8 left-8 right-8 flex justify-between text-[11px] text-gray-500 hidden lg:flex font-medium tracking-wide">
                    <Link to="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
                    <span>&copy; {new Date().getFullYear()} Pieza. All rights reserved.</span>
                </div>
            </div>
        </div>
    );
}

export default Login;