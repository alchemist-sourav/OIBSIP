import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    LayoutDashboard, Package, ShoppingBag, Users, Settings, 
    LogOut, Pizza, TrendingUp, AlertTriangle, Download,
    CheckCircle2, Clock, ChefHat, Truck, ArrowRight, Trash2, Edit2, ShieldAlert, ShieldCheck
} from "lucide-react";
import { Card, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const socket = io(process.env.REACT_APP_API_URL);

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("overview"); // overview, orders, inventory, pizzas, users
    const [orders, setOrders] = useState([]);
    const [inventory, setInventory] = useState([]);
    const [pizzas, setPizzas] = useState([]);
    const [users, setUsers] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        fetchData();

        socket.on("statusUpdated", (updatedOrder) => {
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order._id === updatedOrder._id ? updatedOrder : order
                )
            );
        });
        
        return () => socket.off("statusUpdated");
    }, [navigate, token]);

    const fetchData = async () => {
        try {
            const [ordersRes, invRes, pizzasRes, usersRes] = await Promise.all([
                axios.get(`${process.env.REACT_APP_API_URL}/api/orders`),
                axios.get(`${process.env.REACT_APP_API_URL}/api/inventory`),
                axios.get(`${process.env.REACT_APP_API_URL}/api/pizzas`),
                axios.get(`${process.env.REACT_APP_API_URL}/api/users`)
            ]);
            setOrders(ordersRes.data.reverse());
            setInventory(invRes.data);
            setPizzas(pizzasRes.data);
            setUsers(usersRes.data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
            if (error.response?.status === 401 || error.response?.status === 403) {
                navigate("/login");
            }
        }
    };

    // --- Order Methods ---
    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, { orderStatus: status });
            fetchData();
        } catch (error) { console.error(error); }
    };
    
    // --- Inventory Methods ---
    const restockItem = async (id, currentStock) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/inventory/${id}`, { stock: currentStock + 50 });
            fetchData();
        } catch (error) { console.error(error); }
    };

    // --- Pizza Methods ---
    const deletePizza = async (id) => {
        if(!window.confirm("Are you sure you want to delete this pizza?")) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/pizzas/${id}`);
            fetchData();
        } catch (error) { console.error(error); }
    };

    // --- User Methods ---
    const promoteUser = async (id) => {
        if(!window.confirm("Promote this user to Admin?")) return;
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/users/${id}`, { role: "admin" });
            fetchData();
        } catch (error) { console.error(error); }
    };
    const deleteUser = async (id) => {
        if(!window.confirm("Delete this user?")) return;
        try {
            await axios.delete(`${process.env.REACT_APP_API_URL}/api/users/${id}`);
            fetchData();
        } catch (error) { console.error(error); }
    };

    // --- Analytics Stats ---
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const pendingOrders = orders.filter(o => o.orderStatus !== "Delivered").length;
    const lowStockItems = inventory.filter(i => i.stock <= i.threshold);

    const Sidebar = () => (
        <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col hidden lg:flex fixed inset-y-0 z-50">
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="flex items-center space-x-2 text-xl font-bold text-white tracking-tight">
                    <Pizza className="w-6 h-6 text-primary" />
                    <span>Pieza Admin</span>
                </div>
            </div>
            
            <div className="flex-1 py-6 px-4 space-y-1">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Main Menu</div>
                
                <button 
                    onClick={() => setActiveTab("overview")}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'overview' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    <span className="font-medium">Overview & Analytics</span>
                </button>
                
                <button 
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'orders' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                    <ShoppingBag className="w-5 h-5" />
                    <span className="font-medium flex-1 text-left">Live Orders</span>
                    {pendingOrders > 0 && <span className="bg-white/20 text-white text-xs py-0.5 px-2 rounded-full">{pendingOrders}</span>}
                </button>
                
                <button 
                    onClick={() => setActiveTab("inventory")}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'inventory' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                    <Package className="w-5 h-5" />
                    <span className="font-medium flex-1 text-left">Inventory</span>
                    {lowStockItems.length > 0 && <span className="bg-destructive text-destructive-foreground text-xs py-0.5 px-2 rounded-full">{lowStockItems.length}</span>}
                </button>

                <button 
                    onClick={() => setActiveTab("pizzas")}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'pizzas' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                    <Pizza className="w-5 h-5" />
                    <span className="font-medium flex-1 text-left">Pizza Menu</span>
                </button>
                
                <button 
                    onClick={() => setActiveTab("users")}
                    className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${activeTab === 'users' ? 'bg-primary text-white' : 'hover:bg-slate-800 hover:text-white'}`}
                >
                    <Users className="w-5 h-5" />
                    <span className="font-medium flex-1 text-left">Customers</span>
                </button>
            </div>
            
            <div className="p-4 border-t border-slate-800">
                <button 
                    onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} 
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Log out</span>
                </button>
            </div>
        </aside>
    );

    const getStatusStep = (status) => {
        if (!status) return 0;
        if (status.includes("Received")) return 1;
        if (status.includes("Kitchen")) return 2;
        if (status.includes("Delivery")) return 3;
        if (status.includes("Delivered")) return 4;
        return 1;
    };

    const OrderTimeline = ({ status }) => {
        const step = getStatusStep(status);
        const steps = [
            { id: 1, label: "Received", icon: Clock },
            { id: 2, label: "Kitchen", icon: ChefHat },
            { id: 3, label: "Dispatch", icon: Truck },
            { id: 4, label: "Delivered", icon: CheckCircle2 }
        ];

        return (
            <div className="flex items-center justify-between w-full max-w-sm mt-4">
                {steps.map((s, index) => {
                    const Icon = s.icon;
                    const isActive = step >= s.id;
                    const isLast = index === steps.length - 1;
                    
                    return (
                        <div key={s.id} className={`flex items-center ${!isLast ? 'flex-1' : ''}`}>
                            <div className="flex flex-col items-center relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors z-10 bg-white
                                    ${isActive ? 'border-primary text-primary' : 'border-slate-200 text-slate-300'}`}
                                >
                                    <Icon className="w-4 h-4" />
                                </div>
                            </div>
                            {!isLast && (
                                <div className={`flex-1 h-0.5 mx-2 transition-colors ${step > s.id ? 'bg-primary' : 'bg-slate-100'}`}></div>
                            )}
                        </div>
                    )
                })}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans flex">
            <Sidebar />
            
            {/* Main Content */}
            <main className="flex-1 lg:pl-64 flex flex-col min-h-screen">
                {/* Topbar */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
                    <h1 className="text-xl font-bold text-slate-900 capitalize">
                        {activeTab === 'overview' ? 'Overview & Analytics' : activeTab === 'orders' ? 'Live Orders' : activeTab === 'inventory' ? 'Inventory Management' : activeTab === 'pizzas' ? 'Pizza Management' : 'Customers'}
                    </h1>
                    <div className="flex items-center space-x-4">
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                            <Download className="w-4 h-4 mr-2" />
                            Export Report
                        </Button>
                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold">
                            A
                        </div>
                    </div>
                </header>
                
                {/* Content Area */}
                <div className="flex-1 p-8 overflow-y-auto">
                    {/* OVERVIEW TAB */}
                    {activeTab === 'overview' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="border-0 shadow-glass">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Total Revenue</p>
                                                <h3 className="text-3xl font-bold text-slate-900">₹{totalRevenue.toLocaleString()}</h3>
                                            </div>
                                            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-glass">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Total Orders</p>
                                                <h3 className="text-3xl font-bold text-slate-900">{totalOrders}</h3>
                                            </div>
                                            <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                                                <ShoppingBag className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-glass">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Active Users</p>
                                                <h3 className="text-3xl font-bold text-slate-900">{users.length}</h3>
                                            </div>
                                            <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl">
                                                <Users className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                                <Card className="border-0 shadow-glass">
                                    <CardContent className="p-6">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500 mb-1">Low Stock Alerts</p>
                                                <h3 className="text-3xl font-bold text-slate-900">{lowStockItems.length}</h3>
                                            </div>
                                            <div className={`p-3 rounded-xl ${lowStockItems.length > 0 ? 'bg-destructive/10 text-destructive' : 'bg-slate-100 text-slate-400'}`}>
                                                <AlertTriangle className="w-5 h-5" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <Card className="border-0 shadow-glass lg:col-span-2">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-900">Revenue Analytics</h3>
                                    </div>
                                    <div className="p-6 h-64 flex items-end gap-2 border-t border-slate-100 pt-8 mt-2 relative">
                                        {/* Mock Chart */}
                                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                                                <div className="w-full bg-primary/20 rounded-t-sm relative group-hover:bg-primary transition-colors" style={{ height: `${h}%` }}>
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">₹{h * 100}</span>
                                                </div>
                                                <span className="text-xs text-slate-400 font-medium">Day {i+1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                                
                                <Card className="border-0 shadow-glass col-span-1">
                                    <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                                        <h3 className="font-bold text-slate-900">Inventory Status</h3>
                                        <Button variant="ghost" size="sm" onClick={() => setActiveTab("inventory")}>Manage <ArrowRight className="w-4 h-4 ml-1" /></Button>
                                    </div>
                                    <div className="p-6 space-y-4">
                                        {inventory.slice(0, 5).map(item => {
                                            const percent = Math.min(100, (item.stock / 200) * 100);
                                            const isLow = item.stock <= item.threshold;
                                            return (
                                                <div key={item._id} className="space-y-2">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="font-medium text-slate-700">{item.itemName}</span>
                                                        <span className={`font-bold ${isLow ? 'text-destructive' : 'text-slate-500'}`}>{item.stock} left</span>
                                                    </div>
                                                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                        <div 
                                                            className={`h-full rounded-full ${isLow ? 'bg-destructive' : 'bg-primary'}`} 
                                                            style={{ width: `${percent}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </Card>
                            </div>
                        </motion.div>
                    )}

                    {/* ORDERS TAB */}
                    {activeTab === 'orders' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                            {orders.length === 0 ? (
                                <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
                                    <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                    <h3 className="text-xl font-bold text-slate-700 mb-2">No active orders</h3>
                                    <p className="text-slate-500">Wait for customers to place an order.</p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <Card key={order._id} className="border-0 shadow-sm border border-slate-100 hover:shadow-md transition-shadow overflow-hidden">
                                        <div className="bg-slate-50/50 p-4 border-b border-slate-100 flex justify-between items-center">
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm font-mono text-slate-500 font-semibold">#{order._id.slice(-6)}</span>
                                                <Badge variant="outline" className="bg-white">{new Date(order.createdAt || Date.now()).toLocaleTimeString()}</Badge>
                                            </div>
                                            <div className="font-black text-slate-900">₹{order.totalPrice}</div>
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-slate-900 text-xl">{order.pizza.base}</h4>
                                                    <p className="text-sm text-slate-600 mt-1">
                                                        {order.pizza.sauce} Sauce • {order.pizza.cheese} Cheese
                                                    </p>
                                                    {order.pizza.veggies && order.pizza.veggies.length > 0 && (
                                                        <div className="flex flex-wrap gap-2 mt-3">
                                                            {order.pizza.veggies.map(v => (
                                                                <span key={v} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md font-medium">
                                                                    {v}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <div className="flex-1 flex flex-col items-center justify-center">
                                                    <OrderTimeline status={order.orderStatus} />
                                                    <div className="mt-6 flex gap-2 w-full max-w-sm">
                                                        <Button 
                                                            size="sm" variant="outline" className="flex-1"
                                                            onClick={() => updateStatus(order._id, "In Kitchen")}
                                                            disabled={getStatusStep(order.orderStatus) >= 2}
                                                        >
                                                            Cook
                                                        </Button>
                                                        <Button 
                                                            size="sm" variant="outline" className="flex-1"
                                                            onClick={() => updateStatus(order._id, "Sent To Delivery")}
                                                            disabled={getStatusStep(order.orderStatus) >= 3}
                                                        >
                                                            Dispatch
                                                        </Button>
                                                        <Button 
                                                            size="sm" className="flex-1"
                                                            onClick={() => updateStatus(order._id, "Delivered")}
                                                            disabled={getStatusStep(order.orderStatus) >= 4}
                                                        >
                                                            Deliver
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* INVENTORY TAB */}
                    {activeTab === 'inventory' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="border-0 shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 bg-slate-50/50 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-900 text-lg">Stock Management</h3>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <th className="p-4 pl-6">Item Name</th>
                                                <th className="p-4">Category</th>
                                                <th className="p-4">Current Stock</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4 pr-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {inventory.map(item => {
                                                const isLow = item.stock <= item.threshold;
                                                return (
                                                    <tr key={item._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                        <td className="p-4 pl-6 font-medium text-slate-900">{item.itemName}</td>
                                                        <td className="p-4 text-slate-500">{item.category}</td>
                                                        <td className="p-4">
                                                            <div className="flex items-center space-x-3">
                                                                <span className="font-bold text-slate-900 w-8">{item.stock}</span>
                                                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div 
                                                                        className={`h-full rounded-full ${isLow ? 'bg-destructive' : 'bg-primary'}`} 
                                                                        style={{ width: `${Math.min(100, (item.stock / 200) * 100)}%` }}
                                                                    ></div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="p-4">
                                                            {isLow ? (
                                                                <Badge variant="destructive" className="bg-destructive/10 text-destructive border-0">Low Stock</Badge>
                                                            ) : (
                                                                <Badge variant="success" className="bg-emerald-100 text-emerald-700 border-0">In Stock</Badge>
                                                            )}
                                                        </td>
                                                        <td className="p-4 pr-6 text-right">
                                                            <Button size="sm" variant="outline" onClick={() => restockItem(item._id, item.stock)}>
                                                                +50 Restock
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* PIZZAS TAB */}
                    {activeTab === 'pizzas' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="border-0 shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 text-lg">Pizza Menu Management</h3>
                                    <Button size="sm">Add New Pizza</Button>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <th className="p-4 pl-6">Pizza Name</th>
                                                <th className="p-4">Base Price</th>
                                                <th className="p-4">Variants</th>
                                                <th className="p-4 pr-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {pizzas.map(pizza => (
                                                <tr key={pizza._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-4 pl-6 font-bold text-slate-900">{pizza.name}</td>
                                                    <td className="p-4 font-medium text-emerald-600">₹{pizza.price}</td>
                                                    <td className="p-4 text-slate-500">
                                                        <div className="flex gap-1">
                                                            <Badge variant="outline">{pizza.bases?.length || 0} Bases</Badge>
                                                            <Badge variant="outline">{pizza.sauces?.length || 0} Sauces</Badge>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 pr-6 flex justify-end gap-2">
                                                        <Button size="icon" variant="outline" className="h-8 w-8 text-blue-600"><Edit2 className="w-4 h-4" /></Button>
                                                        <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200" onClick={() => deletePizza(pizza._id)}><Trash2 className="w-4 h-4" /></Button>
                                                    </td>
                                                </tr>
                                            ))}
                                            {pizzas.length === 0 && (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-8 text-slate-500">No pizzas found. Add some to your menu.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                    {/* USERS TAB */}
                    {activeTab === 'users' && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                            <Card className="border-0 shadow-sm border border-slate-100 overflow-hidden">
                                <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-900 text-lg">Customer Management</h3>
                                </div>
                                <div className="p-0 overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                                                <th className="p-4 pl-6">Name</th>
                                                <th className="p-4">Email</th>
                                                <th className="p-4">Status</th>
                                                <th className="p-4">Role</th>
                                                <th className="p-4 pr-6 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="text-sm">
                                            {users.map(user => (
                                                <tr key={user._id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                                                    <td className="p-4 pl-6 font-medium text-slate-900">{user.name}</td>
                                                    <td className="p-4 text-slate-600">{user.email}</td>
                                                    <td className="p-4">
                                                        {user.isVerified ? (
                                                            <Badge variant="success" className="bg-emerald-100 text-emerald-700 border-0">Verified</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="bg-slate-100 text-slate-500 border-0">Pending</Badge>
                                                        )}
                                                    </td>
                                                    <td className="p-4">
                                                        {user.role === 'admin' ? (
                                                            <div className="flex items-center text-primary font-bold text-xs"><ShieldCheck className="w-4 h-4 mr-1" /> ADMIN</div>
                                                        ) : (
                                                            <div className="flex items-center text-slate-500 font-medium text-xs">USER</div>
                                                        )}
                                                    </td>
                                                    <td className="p-4 pr-6 flex justify-end gap-2">
                                                        {user.role !== 'admin' && (
                                                            <Button size="sm" variant="outline" onClick={() => promoteUser(user._id)} className="text-primary hover:text-primary hover:bg-primary/5">
                                                                Make Admin
                                                            </Button>
                                                        )}
                                                        <Button size="icon" variant="outline" onClick={() => deleteUser(user._id)} className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Card>
                        </motion.div>
                    )}

                </div>
            </main>
        </div>
    );
}

export default AdminDashboard;
