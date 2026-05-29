import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io(process.env.REACT_APP_API_URL);

const getImageForOption = (name, category) => {
    const l = "https://loremflickr.com/200/200/";
    const images = {
        'Thin Crust': l + 'pizza,dough/all?lock=1',
        'Wheat Base': l + 'pizza,crust/all?lock=2',
        'Cheese Burst': l + 'pizza,slice/all?lock=3',
        'Classic Base': l + 'pizza,food/all?lock=4',
        'Stuffed Crust': l + 'pizza,stuffed/all?lock=5',
        'Tomato': l + 'tomato,sauce/all?lock=6',
        'BBQ': l + 'bbq,sauce/all?lock=7',
        'Pesto': l + 'pesto,sauce/all?lock=8',
        'Spicy': l + 'chili,sauce/all?lock=9',
        'Garlic': l + 'garlic,sauce/all?lock=10',
        'Mozzarella': l + 'mozzarella,cheese/all?lock=11',
        'Cheddar': l + 'cheddar,cheese/all?lock=12',
        'Parmesan': l + 'parmesan,cheese/all?lock=13',
        'Onion': l + 'sliced,onion/all?lock=14',
        'Capsicum': l + 'sliced,capsicum/all?lock=15',
        'Corn': l + 'sweet,corn/all?lock=16',
        'Mushroom': l + 'sliced,mushroom/all?lock=17',
        'Olives': l + 'sliced,olive/all?lock=18',
        'Jalapeno': l + 'sliced,jalapeno/all?lock=19'
    };

    if (images[name]) return images[name];
    if (category === 'base') return l + 'pizza,dough/all?lock=1';
    if (category === 'sauce') return l + 'tomato,sauce/all?lock=6';
    if (category === 'cheese') return l + 'mozzarella,cheese/all?lock=11';
    if (category === 'veggie') return l + 'sliced,onion/all?lock=14';
    
    return l + 'pizza,ingredients/all?lock=20';
};

function Dashboard() {
    const navigate = useNavigate();
    const [pizza, setPizza] = useState({
        base: "",
        sauce: "",
        cheese: "",
        veggies: []
    });

    const [orders, setOrders] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Dynamic Inventory State
    const [inventory, setInventory] = useState({
        bases: [],
        sauces: [],
        cheeses: [],
        veggies: []
    });

    useEffect(() => {
        fetchOrders();
        fetchInventory();

        socket.on("statusUpdated", (updatedOrder) => {
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === updatedOrder._id ? updatedOrder : order
                )
            );
        });
        
        return () => {
            socket.off("statusUpdated");
        };
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`);
            setOrders(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    
    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/inventory`);
            const items = response.data;
            
            // Filter out items with 0 stock
            const inStockItems = items.filter(item => item.stock > 0);
            
            setInventory({
                bases: inStockItems.filter(i => i.category === "Base").map(i => i.itemName),
                sauces: inStockItems.filter(i => i.category === "Sauce").map(i => i.itemName),
                cheeses: inStockItems.filter(i => i.category === "Cheese").map(i => i.itemName),
                veggies: inStockItems.filter(i => i.category === "Veggie").map(i => i.itemName)
            });
        } catch (error) {
            console.log(error);
        }
    };

    const handleVeggies = (veggie) => {
        if (pizza.veggies.includes(veggie)) {
            setPizza({
                ...pizza,
                veggies: pizza.veggies.filter((v) => v !== veggie)
            });
        } else {
            setPizza({
                ...pizza,
                veggies: [...pizza.veggies, veggie]
            });
        }
    };

    const calculatePrice = () => {
        let total = 0;
        if (pizza.base) total += 120;
        if (pizza.sauce) total += 40;
        if (pizza.cheese) total += 60;
        total += (pizza.veggies.length * 30);
        return total;
    };

    const currentPrice = calculatePrice();

    const placeOrder = async () => {
        if (!pizza.base || !pizza.sauce || !pizza.cheese) {
            alert("Please select a base, sauce, and cheese to continue!");
            return;
        }

        const confirmPayment = window.confirm(`Proceed to fake payment of ₹${currentPrice} ?`);
        if (!confirmPayment) return;

        setIsProcessing(true);

        try {
            // Simulate Payment Delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Save Order to DB
            await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, {
                pizza,
                totalPrice: currentPrice,
                paymentStatus: "Paid"
            });

            alert("Payment Successful & Order Placed!");
            setPizza({ base: "", sauce: "", cheese: "", veggies: [] });
            fetchOrders();
            fetchInventory(); // Refresh stock
        } catch (error) {
            console.log(error);
            alert("Failed to place order.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    const getStatusColor = (status) => {
        switch(status) {
            case "Order Placed": return "bg-blue-100 text-blue-800 border-blue-200";
            case "In Kitchen": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Sent To Delivery": return "bg-orange-100 text-orange-800 border-orange-200";
            case "Delivered": return "bg-green-100 text-green-800 border-green-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* Top Navigation */}
            <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="text-3xl font-extrabold text-orange-600 tracking-tighter cursor-pointer" onClick={() => navigate("/")}>
                    Pieza.
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-gray-600 hidden md:inline-block">Welcome back!</span>
                    <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} className="px-5 py-2 text-red-500 font-semibold hover:bg-red-50 rounded-lg transition">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                
                {/* Left Column: Build Your Pizza */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl font-bold text-gray-900">Build Your Pizza</h2>
                            <span className="px-4 py-1 bg-green-100 text-green-800 font-bold rounded-full text-sm">₹{currentPrice}</span>
                        </div>
                        
                        {/* Base Selection */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">1</span>
                                Select Base
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {inventory.bases.length === 0 ? <p className="text-sm text-gray-500">Out of stock</p> : inventory.bases.map(option => (
                                    <button 
                                        key={option}
                                        onClick={() => setPizza({...pizza, base: option})}
                                        className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all flex flex-col items-center justify-center gap-3 ${pizza.base === option ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-md transform scale-[1.02]' : 'border-gray-200 text-gray-600 hover:border-orange-300 hover:shadow-sm bg-white hover:bg-orange-50/50'}`}
                                    >
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent shadow-sm">
                                            <img src={getImageForOption(option, 'base')} alt={option} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-center">{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sauce Selection */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">2</span>
                                Select Sauce
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {inventory.sauces.length === 0 ? <p className="text-sm text-gray-500">Out of stock</p> : inventory.sauces.map(option => (
                                    <button 
                                        key={option}
                                        onClick={() => setPizza({...pizza, sauce: option})}
                                        className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all flex flex-col items-center justify-center gap-3 ${pizza.sauce === option ? 'border-red-500 bg-red-50 text-red-700 shadow-md transform scale-[1.02]' : 'border-gray-200 text-gray-600 hover:border-red-300 hover:shadow-sm bg-white hover:bg-red-50/50'}`}
                                    >
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent shadow-sm">
                                            <img src={getImageForOption(option, 'sauce')} alt={option} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-center">{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Cheese Selection */}
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">3</span>
                                Select Cheese
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {inventory.cheeses.length === 0 ? <p className="text-sm text-gray-500">Out of stock</p> : inventory.cheeses.map(option => (
                                    <button 
                                        key={option}
                                        onClick={() => setPizza({...pizza, cheese: option})}
                                        className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all flex flex-col items-center justify-center gap-3 ${pizza.cheese === option ? 'border-yellow-400 bg-yellow-50 text-yellow-700 shadow-md transform scale-[1.02]' : 'border-gray-200 text-gray-600 hover:border-yellow-300 hover:shadow-sm bg-white hover:bg-yellow-50/50'}`}
                                    >
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent shadow-sm">
                                            <img src={getImageForOption(option, 'cheese')} alt={option} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="text-center">{option}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Veggies Selection */}
                        <div className="mb-10">
                            <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mr-3">4</span>
                                Select Veggies
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {inventory.veggies.length === 0 ? <p className="text-sm text-gray-500">Out of stock</p> : inventory.veggies.map(veggie => {
                                    const isSelected = pizza.veggies.includes(veggie);
                                    return (
                                        <button 
                                            key={veggie}
                                            onClick={() => handleVeggies(veggie)}
                                            className={`py-1.5 pr-5 pl-1.5 rounded-full border-2 text-sm font-semibold transition-all flex items-center gap-3 ${isSelected ? 'border-green-500 bg-green-50 text-green-700 shadow-md' : 'border-gray-200 text-gray-600 hover:border-green-300 bg-white hover:bg-green-50/50'}`}
                                        >
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative shadow-sm border border-black/5">
                                                <img src={getImageForOption(veggie, 'veggie')} alt={veggie} className="w-full h-full object-cover" />
                                                {isSelected && (
                                                    <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center text-white backdrop-blur-[1px]">
                                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <span>{veggie}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <button 
                            onClick={placeOrder}
                            disabled={isProcessing}
                            className="w-full py-4 bg-orange-600 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-orange-700 hover:shadow-xl transition transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isProcessing ? "Processing Payment..." : `Place Order (₹${currentPrice})`}
                        </button>
                    </div>
                </div>

                {/* Right Column: Orders */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center justify-between">
                            Order History
                            <span className="bg-gray-100 text-gray-600 text-xs py-1 px-3 rounded-full">{orders.length} orders</span>
                        </h2>
                        
                        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                            {orders.length === 0 ? (
                                <div className="text-center py-10 text-gray-400">
                                    <div className="text-4xl mb-3">🍕</div>
                                    <p>No orders yet!</p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div key={order._id} className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition bg-gray-50 group">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-xs text-gray-400 font-mono">#{order._id.slice(-6)}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus || "Pending"}
                                            </span>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <h4 className="font-bold text-gray-800 text-lg">{order.pizza.base}</h4>
                                            <p className="text-sm text-gray-600 mt-1">
                                                {order.pizza.sauce} Sauce • {order.pizza.cheese} Cheese
                                            </p>
                                            {order.pizza.veggies.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {order.pizza.veggies.map(v => (
                                                        <span key={v} className="text-xs bg-white border border-gray-200 px-2 py-1 rounded text-gray-500">
                                                            {v}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
            
            {/* Custom scrollbar styles */}
            <style jsx="true">{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #f1f1f1; 
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db; 
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af; 
                }
            `}</style>
        </div>
    );
}

export default Dashboard;