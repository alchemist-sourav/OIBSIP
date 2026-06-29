import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2, Pizza, CheckCircle2, ArrowLeft } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
            setMessage(response.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "An error occurred");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            <div className="w-full flex flex-col justify-center items-center px-8 relative z-10 bg-slate-50">
                <div className="absolute top-8 left-8 flex items-center space-x-2 text-primary font-bold text-xl tracking-tight">
                    <Pizza className="w-6 h-6" />
                    <span>Pieza</span>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-md w-full bg-white p-10 rounded-[2rem] shadow-glass border border-slate-100 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                    
                    <div className="text-center mb-8 relative z-10">
                        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                        </div>
                        <h1 className="text-2xl font-bold mb-2 text-slate-900 tracking-tight">Reset your password</h1>
                        <p className="text-slate-500 text-sm">Enter your email address and we will send you a link to reset your password.</p>
                    </div>

                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-accent/10 border border-accent/20 px-4 py-3 rounded-xl mb-6 text-sm flex items-start space-x-3 relative z-10"
                        >
                            <CheckCircle2 className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                            <span className="text-accent-foreground leading-relaxed">{message}</span>
                        </motion.div>
                    )}
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl mb-6 text-sm flex items-center space-x-2 relative z-10"
                        >
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
                        <div className="space-y-1.5">
                            <label className="block text-slate-700 text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                placeholder="name@example.com"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="h-11"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-11 text-base mt-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm relative z-10">
                        <Link to="/login" className="text-slate-500 hover:text-slate-900 font-medium inline-flex items-center transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to log in
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

export default ForgotPassword;
