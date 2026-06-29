import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Pizza, History, LogOut, ChevronRight, ChevronLeft, CreditCard, CheckCircle2, Loader2, Package, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";

const socket = io(process.env.REACT_APP_API_URL);

const getImageForOption = (name, category) => {
    const l = "https://loremflickr.com/200/200/";
    const images = {
        'Thin Crust': l + 'pizza,dough/all?lock=1',
        'Hand Tossed': l + 'pizza,crust/all?lock=2',
        'Cheese Burst': l + 'pizza,slice/all?lock=3',
        'Stuffed Crust': l + 'pizza,stuffed/all?lock=5',
        'Whole Wheat': l + 'pizza,wheat/all?lock=4',
        'Tomato': l + 'tomato,sauce/all?lock=6',
        'BBQ': l + 'bbq,sauce/all?lock=7',
        'Garlic': l + 'garlic,sauce/all?lock=10',
        'Pesto': l + 'pesto,sauce/all?lock=8',
        'Spicy Marinara': l + 'chili,sauce/all?lock=9',
        'Mozzarella': l + 'mozzarella,cheese/all?lock=11',
        'Cheddar': l + 'cheddar,cheese/all?lock=12',
        'Parmesan': l + 'parmesan,cheese/all?lock=13',
        'Goat Cheese': l + 'goat,cheese/all?lock=111',
        'Vegan Cheese': l + 'vegan,cheese/all?lock=112',
        'Onion': l + 'sliced,onion/all?lock=14',
        'Capsicum': l + 'sliced,capsicum/all?lock=15',
        'Mushroom': l + 'sliced,mushroom/all?lock=17',
        'Corn': l + 'sweet,corn/all?lock=16',
        'Olive': l + 'sliced,olive/all?lock=18',
        'Jalapeño': l + 'sliced,jalapeno/all?lock=19',
        'Paneer': l + 'paneer,cheese/all?lock=115',
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
    const [activeTab, setActiveTab] = useState("build"); // build, history
    const [step, setStep] = useState(1);
    
    const [pizza, setPizza] = useState({
        base: "",
        sauce: "",
        cheese: "",
        veggies: []
    });

    const [orders, setOrders] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    const [inventory, setInventory] = useState({ bases: [], sauces: [], cheeses: [], veggies: [] });
    const [isLoadingInventory, setIsLoadingInventory] = useState(true);
    const [inventoryError, setInventoryError] = useState(null);

    useEffect(() => {
        fetchOrders();
        fetchInventory();
        socket.on("statusUpdated", (updatedOrder) => {
            setOrders((prev) => prev.map((order) => order._id === updatedOrder._id ? updatedOrder : order));
        });
        return () => socket.off("statusUpdated");
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders`);
            setOrders(response.data);
        } catch (error) { console.error(error); }
    };
    
    const fetchInventory = async () => {
        setIsLoadingInventory(true);
        setInventoryError(null);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/inventory`);
            const items = response.data.filter(item => item.stock > 0);
            setInventory({
                bases: items.filter(i => i.category === "Base").map(i => i.itemName),
                sauces: items.filter(i => i.category === "Sauce").map(i => i.itemName),
                cheeses: items.filter(i => i.category === "Cheese").map(i => i.itemName),
                veggies: items.filter(i => i.category === "Veggie").map(i => i.itemName)
            });
        } catch (error) { 
            console.error(error); 
            setInventoryError("Failed to load ingredients. Please try again.");
        } finally {
            setIsLoadingInventory(false);
        }
    };

    const handleVeggies = (veggie) => {
        if (pizza.veggies.includes(veggie)) setPizza({ ...pizza, veggies: pizza.veggies.filter((v) => v !== veggie) });
        else setPizza({ ...pizza, veggies: [...pizza.veggies, veggie] });
    };

    const currentPrice = useMemo(() => {
        let total = 0;
        if (pizza.base) total += 120;
        if (pizza.sauce) total += 40;
        if (pizza.cheese) total += 60;
        total += (pizza.veggies.length * 30);
        return total;
    }, [pizza]);

    const placeOrder = async () => {
        setIsProcessing(true);
        try {
            // Simulate a fake payment processing delay
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Directly create the order without Razorpay validation for the fake flow
            await axios.post(`${process.env.REACT_APP_API_URL}/api/orders`, {
                pizza, 
                totalPrice: currentPrice, 
                paymentStatus: "Paid"
            });
            
            setPizza({ base: "", sauce: "", cheese: "", veggies: [] });
            setStep(1);
            setActiveTab("history");
            fetchOrders();
            fetchInventory(); 
            
        } catch (error) {
            console.error("Payment failed", error);
            alert("Failed to process payment. Please try again.");
        } finally {
            setIsProcessing(false);
        }
    };
    
    const getStatusVariant = (status) => {
        switch(status) {
            case "Order Placed": return "secondary";
            case "In Kitchen": return "default";
            case "Sent To Delivery": return "outline";
            case "Delivered": return "success";
            default: return "outline";
        }
    };

    const StepIndicator = () => (
        <div className="flex items-center justify-between mb-8 relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-100 -z-10"></div>
            {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors shadow-sm
                        ${step === s ? 'bg-primary text-white ring-4 ring-primary/20' : 
                          step > s ? 'bg-primary text-white' : 'bg-white text-slate-400 border border-slate-200'}`}
                    >
                        {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                    </div>
                    <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-slate-900' : 'text-slate-400'}`}>
                        {s === 1 ? 'Base' : s === 2 ? 'Sauce' : s === 3 ? 'Cheese' : s === 4 ? 'Veggies' : 'Review'}
                    </span>
                </div>
            ))}
        </div>
    );

    const SkeletonGrid = () => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="p-4 rounded-xl border-2 border-slate-100 flex flex-col items-center gap-3 bg-white/50 animate-pulse">
                    <div className="w-16 h-16 rounded-full bg-slate-200"></div>
                    <div className="w-20 h-4 bg-slate-200 rounded"></div>
                </div>
            ))}
        </div>
    );

    const EmptyState = ({ message }) => (
        <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700 mb-2">Ingredients Unavailable</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">{message}</p>
            <Button onClick={fetchInventory} variant="outline" className="bg-white">
                <RefreshCw className="w-4 h-4 mr-2" /> Retry Fetch
            </Button>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
            {/* Top Navigation */}
            <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center space-x-2 text-2xl font-bold text-slate-900 tracking-tight cursor-pointer" onClick={() => navigate("/")}>
                    <Pizza className="w-6 h-6 text-primary" />
                    <span>Pieza.</span>
                </div>
                <div className="flex items-center space-x-2 bg-slate-100 p-1 rounded-xl">
                    <button 
                        onClick={() => setActiveTab("build")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'build' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Build Pizza
                    </button>
                    <button 
                        onClick={() => setActiveTab("history")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        Order History
                    </button>
                </div>
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} title="Logout">
                        <LogOut className="w-5 h-5 text-slate-500" />
                    </Button>
                </div>
            </nav>

            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                {activeTab === "build" ? (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left: Builder Stepper */}
                        <div className="lg:w-2/3">
                            <Card className="border-0 shadow-glass">
                                <CardContent className="p-8">
                                    <StepIndicator />
                                    
                                    <div className="min-h-[400px]">
                                        {inventoryError ? (
                                            <EmptyState message={inventoryError} />
                                        ) : (
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={step}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -20 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                {step === 1 && (
                                                    <div>
                                                        <h2 className="text-2xl font-bold mb-6 text-slate-900">Choose your base</h2>
                                                        {isLoadingInventory ? <SkeletonGrid /> : 
                                                         inventory.bases.length === 0 ? <EmptyState message="No bases are currently available in stock." /> : (
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                                {inventory.bases.map(option => (
                                                                    <button 
                                                                        key={option}
                                                                        onClick={() => setPizza({...pizza, base: option})}
                                                                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 bg-white
                                                                            ${pizza.base === option ? 'border-primary shadow-sm bg-primary/5' : 'border-slate-100 hover:border-primary/40 hover:bg-slate-50'}`}
                                                                    >
                                                                        <img src={getImageForOption(option, 'base')} className="w-16 h-16 rounded-full object-cover shadow-sm" alt={option} />
                                                                        <span className={`font-semibold text-sm text-center ${pizza.base === option ? 'text-primary' : 'text-slate-700'}`}>{option}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {step === 2 && (
                                                    <div>
                                                        <h2 className="text-2xl font-bold mb-6 text-slate-900">Choose your sauce</h2>
                                                        {isLoadingInventory ? <SkeletonGrid /> : 
                                                         inventory.sauces.length === 0 ? <EmptyState message="No sauces are currently available in stock." /> : (
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                                {inventory.sauces.map(option => (
                                                                    <button 
                                                                        key={option}
                                                                        onClick={() => setPizza({...pizza, sauce: option})}
                                                                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 bg-white
                                                                            ${pizza.sauce === option ? 'border-red-500 shadow-sm bg-red-50' : 'border-slate-100 hover:border-red-200 hover:bg-slate-50'}`}
                                                                    >
                                                                        <img src={getImageForOption(option, 'sauce')} className="w-16 h-16 rounded-full object-cover shadow-sm" alt={option} />
                                                                        <span className={`font-semibold text-sm text-center ${pizza.sauce === option ? 'text-red-700' : 'text-slate-700'}`}>{option}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {step === 3 && (
                                                    <div>
                                                        <h2 className="text-2xl font-bold mb-6 text-slate-900">Choose your cheese</h2>
                                                        {isLoadingInventory ? <SkeletonGrid /> : 
                                                         inventory.cheeses.length === 0 ? <EmptyState message="No cheeses are currently available in stock." /> : (
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                                                {inventory.cheeses.map(option => (
                                                                    <button 
                                                                        key={option}
                                                                        onClick={() => setPizza({...pizza, cheese: option})}
                                                                        className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 bg-white
                                                                            ${pizza.cheese === option ? 'border-amber-400 shadow-sm bg-amber-50' : 'border-slate-100 hover:border-amber-200 hover:bg-slate-50'}`}
                                                                    >
                                                                        <img src={getImageForOption(option, 'cheese')} className="w-16 h-16 rounded-full object-cover shadow-sm" alt={option} />
                                                                        <span className={`font-semibold text-sm text-center ${pizza.cheese === option ? 'text-amber-700' : 'text-slate-700'}`}>{option}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {step === 4 && (
                                                    <div>
                                                        <h2 className="text-2xl font-bold mb-6 text-slate-900">Add veggies</h2>
                                                        {isLoadingInventory ? <SkeletonGrid /> : 
                                                         inventory.veggies.length === 0 ? <EmptyState message="No vegetables are currently available in stock." /> : (
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                                {inventory.veggies.map(option => {
                                                                    const isSelected = pizza.veggies.includes(option);
                                                                    return (
                                                                        <button 
                                                                            key={option}
                                                                            onClick={() => handleVeggies(option)}
                                                                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-3 bg-white
                                                                                ${isSelected ? 'border-emerald-500 shadow-sm bg-emerald-50' : 'border-slate-100 hover:border-emerald-200 hover:bg-slate-50'}`}
                                                                        >
                                                                            <div className="relative">
                                                                                <img src={getImageForOption(option, 'veggie')} className="w-12 h-12 rounded-full object-cover shadow-sm" alt={option} />
                                                                                {isSelected && (
                                                                                    <div className="absolute inset-0 bg-emerald-500/80 rounded-full flex items-center justify-center">
                                                                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                                                                    </div>
                                                                                )}
                                                                            </div>
                                                                            <span className={`font-semibold text-xs text-center ${isSelected ? 'text-emerald-700' : 'text-slate-700'}`}>{option}</span>
                                                                        </button>
                                                                    )
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}

                                                {step === 5 && (
                                                    <div className="text-center py-10">
                                                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                                            <Pizza className="w-12 h-12 text-primary" />
                                                        </div>
                                                        <h2 className="text-3xl font-bold mb-4 text-slate-900">Review your order</h2>
                                                        <p className="text-slate-500 mb-8 max-w-sm mx-auto">Your custom pizza is ready to be prepared. Review the details on the right and proceed to checkout.</p>
                                                    </div>
                                                )}
                                            </motion.div>
                                        </AnimatePresence>
                                        )}
                                    </div>
                                    
                                    <div className="mt-8 flex justify-between items-center border-t border-slate-100 pt-6">
                                        <Button 
                                            variant="outline" 
                                            onClick={() => setStep(s => Math.max(1, s - 1))}
                                            disabled={step === 1}
                                        >
                                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                                        </Button>
                                        
                                        {step < 5 ? (
                                            <Button 
                                                onClick={() => setStep(s => s + 1)}
                                                disabled={
                                                    isLoadingInventory ||
                                                    inventoryError ||
                                                    (step === 1 && !pizza.base) || 
                                                    (step === 2 && !pizza.sauce) || 
                                                    (step === 3 && !pizza.cheese)
                                                }
                                            >
                                                Continue <ChevronRight className="w-4 h-4 ml-2" />
                                            </Button>
                                        ) : (
                                            <Button 
                                                onClick={placeOrder}
                                                disabled={isProcessing}
                                                className="bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                                            >
                                                {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <CreditCard className="w-4 h-4 mr-2" />}
                                                Pay ₹{currentPrice}
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                        
                        {/* Right: Live Preview */}
                        <div className="lg:w-1/3">
                            <Card className="border-0 shadow-glass sticky top-24 overflow-hidden">
                                <div className="bg-slate-900 p-6 text-white text-center relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                                    <h3 className="text-xl font-bold relative z-10">Live Summary</h3>
                                    <div className="text-4xl font-black mt-2 text-primary relative z-10">₹{currentPrice}</div>
                                </div>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                            <span className="text-slate-500 font-medium">Base</span>
                                            <span className="font-semibold text-slate-900">{pizza.base || <span className="text-slate-300 italic">Select base</span>}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                            <span className="text-slate-500 font-medium">Sauce</span>
                                            <span className="font-semibold text-slate-900">{pizza.sauce || <span className="text-slate-300 italic">Select sauce</span>}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                                            <span className="text-slate-500 font-medium">Cheese</span>
                                            <span className="font-semibold text-slate-900">{pizza.cheese || <span className="text-slate-300 italic">Select cheese</span>}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-500 font-medium block mb-2">Veggies ({pizza.veggies.length})</span>
                                            {pizza.veggies.length === 0 ? (
                                                <span className="text-slate-300 italic text-sm">No veggies selected</span>
                                            ) : (
                                                <div className="flex flex-wrap gap-2">
                                                    {pizza.veggies.map(v => (
                                                        <span key={v} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md font-medium">{v}</span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-bold text-slate-900">Order History</h2>
                            <Badge variant="outline" className="px-3 py-1 text-sm bg-white">{orders.length} Orders</Badge>
                        </div>
                        
                        {orders.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                                <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-slate-700 mb-2">No orders yet</h3>
                                <p className="text-slate-500">Your order history will appear here once you place an order.</p>
                                <Button className="mt-6" onClick={() => setActiveTab("build")}>Start Building</Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Card key={order._id} className="border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center space-x-3 mb-2">
                                                        <span className="text-sm font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">#{order._id.slice(-6)}</span>
                                                        <Badge variant={getStatusVariant(order.orderStatus)}>{order.orderStatus || "Pending"}</Badge>
                                                    </div>
                                                    <h4 className="font-bold text-slate-900 text-lg">{order.pizza.base}</h4>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        {order.pizza.sauce} Sauce • {order.pizza.cheese} Cheese
                                                    </p>
                                                    {order.pizza.veggies.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {order.pizza.veggies.map(v => (
                                                                <span key={v} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                                                                    {v}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="text-right flex-shrink-0 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                                                    <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                                                    <p className="text-2xl font-black text-slate-900">₹{order.totalPrice}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default Dashboard;