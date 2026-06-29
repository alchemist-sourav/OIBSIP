import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Pizza, Zap, Shield, Heart } from "lucide-react";

function LandingPage() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-primary/30">
            {/* Navbar */}
            <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-50">
                <div className="flex items-center space-x-2 text-2xl font-bold text-slate-900 tracking-tight">
                    <Pizza className="w-8 h-8 text-primary" />
                    <span>Pieza.</span>
                </div>
                <div className="hidden md:flex space-x-10 text-slate-600 font-medium text-sm">
                    <a href="#menu" className="hover:text-primary transition-colors">Menu</a>
                    <a href="#features" className="hover:text-primary transition-colors">Features</a>
                    <a href="#about" className="hover:text-primary transition-colors">Company</a>
                </div>
                <div className="flex space-x-4 items-center">
                    <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
                        Sign in
                    </Link>
                    <Link to="/register" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-sm">
                        Get Started
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                
                {/* Glow Effects */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/20 rounded-full blur-[100px] -z-10"></div>
                
                <div className="container mx-auto px-6 pt-24 pb-32 text-center relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-8 border border-primary/20">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span>New seasonal menu available</span>
                        </div>
                        
                        <h1 className="text-6xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
                            The modern way to <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">experience pizza.</span>
                        </h1>
                        
                        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Artisan crusts, premium ingredients, and real-time delivery tracking. Upgrade your pizza night with Pieza.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                            <Link to="/register" className="w-full sm:w-auto px-8 py-4 bg-primary text-white text-base font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)] flex items-center justify-center">
                                Order Now
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Link>
                            <a href="#menu" className="w-full sm:w-auto px-8 py-4 bg-white text-slate-900 border border-slate-200 text-base font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
                                View Menu
                            </a>
                        </div>
                    </motion.div>

                    {/* Dashboard Preview Image */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-24 relative mx-auto max-w-5xl"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent z-10 bottom-0 h-1/2 top-auto"></div>
                        <img 
                            src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80" 
                            alt="Dashboard Preview" 
                            className="rounded-2xl shadow-2xl border border-slate-200 object-cover h-[400px] w-full"
                        />
                    </motion.div>
                </div>
            </div>

            {/* Features Section */}
            <div id="features" className="py-24 bg-white relative z-20">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything you need</h2>
                        <p className="text-slate-500">We've thought of everything to make your ordering experience seamless.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Lightning Fast</h3>
                            <p className="text-slate-500 leading-relaxed">Real-time socket connections ensure your order status is updated instantly without refreshing.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-accent/10 text-accent rounded-xl flex items-center justify-center mb-6">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Secure Payments</h3>
                            <p className="text-slate-500 leading-relaxed">Integrated directly with Razorpay for enterprise-grade payment security and reliability.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-shadow">
                            <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center mb-6">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Custom Built</h3>
                            <p className="text-slate-500 leading-relaxed">Use our visual pizza builder to create the exact pizza you're craving with live pricing.</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* CTA Section */}
            <div className="py-24 bg-slate-900 text-white text-center">
                <div className="container mx-auto px-6">
                    <h2 className="text-4xl font-bold mb-6">Ready to slice it up?</h2>
                    <p className="text-slate-400 mb-10 max-w-2xl mx-auto text-lg">Join thousands of customers who have upgraded their pizza experience.</p>
                    <Link to="/register" className="inline-flex items-center px-8 py-4 bg-primary text-white text-base font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg">
                        Start Building Now
                    </Link>
                </div>
            </div>
            
            <footer className="py-8 bg-slate-950 text-slate-500 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} Pieza. Designed for Oasis Infobyte.</p>
            </footer>
        </div>
    );
}

export default LandingPage;
