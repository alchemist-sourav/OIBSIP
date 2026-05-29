import { Link } from "react-router-dom";

function LandingPage() {
    return (
        <div className="min-h-screen bg-orange-50 font-sans">
            {/* Navbar */}
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="text-3xl font-extrabold text-orange-600 tracking-tighter">
                    Pieza.
                </div>
                <div className="hidden md:flex space-x-8 text-gray-700 font-medium">
                    <a href="#home" className="hover:text-orange-500 transition">Home</a>
                    <a href="#menu" className="hover:text-orange-500 transition">Menu</a>
                    <a href="#about" className="hover:text-orange-500 transition">About Us</a>
                    <a href="#contact" className="hover:text-orange-500 transition">Contact</a>
                </div>
                <div className="flex space-x-4">
                    <Link to="/login" className="px-5 py-2 text-orange-600 font-semibold hover:text-orange-700 transition">
                        Login
                    </Link>
                    <Link to="/register" className="px-6 py-2 bg-orange-600 text-white font-bold rounded-full shadow-lg hover:bg-orange-700 hover:shadow-xl transition transform hover:-translate-y-0.5">
                        Sign Up
                    </Link>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="container mx-auto px-6 py-16 flex flex-col md:flex-row items-center">
                {/* Left Content */}
                <div className="md:w-1/2 flex flex-col items-start justify-center pr-10">
                    <div className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full font-bold text-sm mb-6">
                        🌶️ Hot & Spicy Pizzas
                    </div>
                    <h1 className="text-6xl font-extrabold text-gray-900 leading-tight mb-6">
                        It's not just a Pizza, It's an <span className="text-orange-600">Experience.</span>
                    </h1>
                    <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                        Craving the best pizza in town? Our hand-tossed crusts, rich tomato sauce, and fresh premium ingredients make every bite unforgettable. Fast delivery, straight to your door.
                    </p>
                    <div className="flex space-x-4">
                        <Link to="/login" className="px-8 py-4 bg-orange-600 text-white font-bold rounded-full shadow-xl hover:bg-orange-700 hover:shadow-2xl transition transform hover:-translate-y-1 text-lg">
                            Order Now
                        </Link>
                        <a href="#menu" className="px-8 py-4 bg-white text-gray-800 font-bold rounded-full shadow-md hover:shadow-lg transition text-lg flex items-center">
                            View Menu 🍕
                        </a>
                    </div>
                    
                    {/* Stats */}
                    <div className="mt-12 flex space-x-12">
                        <div>
                            <h3 className="text-3xl font-extrabold text-gray-900">120+</h3>
                            <p className="text-gray-500">Menu Items</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-gray-900">15k+</h3>
                            <p className="text-gray-500">Happy Customers</p>
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-gray-900">4.9/5</h3>
                            <p className="text-gray-500">Customer Rating</p>
                        </div>
                    </div>
                </div>

                {/* Right Image */}
                <div className="md:w-1/2 mt-12 md:mt-0 relative">
                    <div className="absolute inset-0 bg-orange-300 rounded-full blur-3xl opacity-30 w-96 h-96 left-1/2 transform -translate-x-1/2 z-0"></div>
                    <img 
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                        alt="Delicious Pizza" 
                        className="relative z-10 w-full h-[600px] object-cover rounded-3xl shadow-2xl transform hover:scale-105 transition duration-500"
                    />
                    
                    {/* Floating Badge */}
                    <div className="absolute bottom-10 left-[-20px] z-20 bg-white p-4 rounded-2xl shadow-xl flex items-center space-x-4 animate-bounce">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
                            🛵
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Fast Delivery</h4>
                            <p className="text-sm text-gray-500">Under 30 minutes</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* How it Works / Features */}
            <div className="bg-white py-20 mt-10" id="menu">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl font-extrabold text-gray-900 mb-12">How it Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="p-8 rounded-3xl bg-orange-50 hover:bg-orange-100 transition duration-300">
                            <div className="text-6xl mb-6">📱</div>
                            <h3 className="text-2xl font-bold mb-4">1. Choose Your Pizza</h3>
                            <p className="text-gray-600">Browse our extensive menu or build your own custom pizza with your favorite toppings.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-orange-50 hover:bg-orange-100 transition duration-300">
                            <div className="text-6xl mb-6">💳</div>
                            <h3 className="text-2xl font-bold mb-4">2. Easy Payment</h3>
                            <p className="text-gray-600">Pay securely online with multiple payment options available for your convenience.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-orange-50 hover:bg-orange-100 transition duration-300">
                            <div className="text-6xl mb-6">🚚</div>
                            <h3 className="text-2xl font-bold mb-4">3. Fast Delivery</h3>
                            <p className="text-gray-600">Track your order in real-time as it's prepared and delivered piping hot to your door.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
