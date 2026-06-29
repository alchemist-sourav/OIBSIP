import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Pizza, CheckCircle2 } from "lucide-react";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

function Register() {
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, formData);
            setMessage(response.data.message);
            setFormData({ name: "", email: "", password: "" });
        } catch (error) {
            setError(error.response?.data?.message || "An error occurred during registration");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex bg-white font-sans overflow-hidden">
            {/* Left Side: Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-8 sm:px-16 md:px-24 xl:px-32 relative z-10 bg-white">
                <div className="absolute top-8 left-8 flex items-center space-x-2 text-primary font-bold text-xl tracking-tight">
                    <Pizza className="w-6 h-6" />
                    <span>Pieza</span>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-sm w-full"
                >
                    <div className="text-left mb-8">
                        <h1 className="text-3xl font-bold mb-2 text-slate-900 tracking-tight">Create an account</h1>
                        <p className="text-slate-500 text-sm">Join Pieza and start ordering today.</p>
                    </div>

                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-accent/10 border border-accent/20 text-accent-foreground px-4 py-3 rounded-xl mb-6 text-sm flex items-center space-x-2"
                        >
                            <CheckCircle2 className="w-5 h-5 text-accent" />
                            <span className="text-accent">{message}</span>
                        </motion.div>
                    )}
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl mb-6 text-sm flex items-center space-x-2"
                        >
                            <span>{error}</span>
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-slate-700 text-sm font-medium">Full Name</label>
                            <Input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                required
                                onChange={handleChange}
                                value={formData.name}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-slate-700 text-sm font-medium">Email</label>
                            <Input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                required
                                onChange={handleChange}
                                value={formData.email}
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-slate-700 text-sm font-medium">Password</label>
                            <Input
                                type="password"
                                name="password"
                                placeholder="Create a strong password"
                                required
                                onChange={handleChange}
                                value={formData.password}
                                className="h-11"
                            />
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-11 text-base mt-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                <>Create Account <ArrowRight className="w-4 h-4 ml-2" /></>
                            )}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-slate-500">
                        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
                    </div>
                </motion.div>
            </div>
            
            {/* Right Side: Decorative */}
            <div className="hidden lg:flex w-1/2 flex-col justify-center items-center relative overflow-hidden bg-slate-50 border-l border-slate-100">
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] bg-accent/10 rounded-full blur-3xl"></div>
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="z-10 text-center max-w-md relative"
                >
                    <div className="relative w-80 h-80 mx-auto mb-10">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-[3rem] transform rotate-3"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=800&q=80" 
                            alt="Fresh Ingredients" 
                            className="absolute inset-0 w-full h-full object-cover rounded-[3rem] shadow-2xl transform -rotate-3 transition-transform hover:rotate-0 duration-500"
                        />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-slate-900 tracking-tight">
                        Fresh ingredients,<br/>every single time.
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed px-4">
                        We pride ourselves on sourcing only the best local produce to ensure every pizza is a masterpiece.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}

export default Register;