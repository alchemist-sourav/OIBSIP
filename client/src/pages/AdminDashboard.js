import { useState, useEffect } from "react";
import axios from "axios";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io(process.env.REACT_APP_API_URL);

function AdminDashboard() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [inventory, setInventory] = useState([]);

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
            // Reverse so newest is first
            setOrders(response.data.reverse());
        } catch (error) {
            console.log(error);
        }
    };
    
    const fetchInventory = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/inventory`);
            setInventory(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, {
                orderStatus: status
            });
            fetchOrders();
        } catch (error) {
            console.log(error);
        }
    };
    
    const restockItem = async (id, currentStock) => {
        try {
            await axios.put(`${process.env.REACT_APP_API_URL}/api/inventory/${id}`, {
                stock: currentStock + 50
            });
            fetchInventory();
        } catch (error) {
            console.log(error);
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case "Order Received": return "bg-blue-100 text-blue-800 border-blue-200";
            case "In Kitchen": return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "Sent To Delivery": return "bg-orange-100 text-orange-800 border-orange-200";
            case "Delivered": return "bg-green-100 text-green-800 border-green-200";
            default: return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 font-sans text-gray-100">
            {/* Top Navigation */}
            <nav className="bg-gray-800 shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-700">
                <div className="text-3xl font-extrabold text-orange-500 tracking-tighter">
                    Pieza. <span className="text-sm font-medium text-gray-400 align-middle ml-2">ADMIN PANEL</span>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} className="px-5 py-2 text-gray-300 font-semibold hover:bg-gray-700 rounded-lg transition border border-gray-600">
                        Logout
                    </button>
                </div>
            </nav>

            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                
                {/* Left Column: Inventory Management */}
                <div className="lg:w-1/2">
                    <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-bold text-white">Inventory Management</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {inventory.map(item => (
                                <div key={item._id} className="bg-gray-700 p-4 rounded-xl flex justify-between items-center border border-gray-600">
                                    <div>
                                        <p className="font-bold text-white">{item.itemName}</p>
                                        <p className="text-xs text-gray-400">{item.category}</p>
                                        <div className="mt-2 flex items-center space-x-2">
                                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${item.stock <= item.threshold ? 'bg-red-500 text-white' : 'bg-gray-600 text-gray-200'}`}>
                                                Stock: {item.stock}
                                            </span>
                                            {item.stock <= item.threshold && <span className="text-red-400 text-xs font-bold">LOW STOCK!</span>}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => restockItem(item._id, item.stock)}
                                        className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow transition"
                                    >
                                        +50
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Order Management */}
                <div className="lg:w-1/2">
                    <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-8 sticky top-24">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-between">
                            Live Orders
                            <span className="bg-gray-700 text-gray-300 text-xs py-1 px-3 rounded-full">{orders.length} total</span>
                        </h2>
                        
                        <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 custom-scrollbar">
                            {orders.length === 0 ? (
                                <div className="text-center py-10 text-gray-500">
                                    <p>No active orders.</p>
                                </div>
                            ) : (
                                orders.map((order) => (
                                    <div key={order._id} className="border border-gray-600 rounded-xl p-5 bg-gray-750 hover:bg-gray-700 transition">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="text-xs text-gray-400 font-mono">ID: #{order._id.slice(-6)}</span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus || "Order Received"}
                                            </span>
                                        </div>
                                        
                                        <div className="mb-4">
                                            <h4 className="font-bold text-gray-200 text-lg">{order.pizza.base}</h4>
                                            <p className="text-sm text-gray-400 mt-1">
                                                {order.pizza.sauce} Sauce • {order.pizza.cheese} Cheese
                                            </p>
                                            {order.pizza.veggies && order.pizza.veggies.length > 0 && (
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {order.pizza.veggies.map(v => (
                                                        <span key={v} className="text-xs bg-gray-600 border border-gray-500 px-2 py-1 rounded text-gray-300">
                                                            {v}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-4 pt-4 border-t border-gray-600 flex gap-2">
                                            <button 
                                                onClick={() => updateStatus(order._id, "In Kitchen")}
                                                disabled={order.orderStatus === "In Kitchen" || order.orderStatus === "Sent To Delivery" || order.orderStatus === "Delivered"}
                                                className="flex-1 py-2 text-xs font-semibold text-yellow-100 bg-yellow-600 rounded hover:bg-yellow-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                Cook
                                            </button>
                                            <button 
                                                onClick={() => updateStatus(order._id, "Sent To Delivery")}
                                                disabled={order.orderStatus === "Sent To Delivery" || order.orderStatus === "Delivered"}
                                                className="flex-1 py-2 text-xs font-semibold text-orange-100 bg-orange-600 rounded hover:bg-orange-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                Dispatch
                                            </button>
                                            <button 
                                                onClick={() => updateStatus(order._id, "Delivered")}
                                                disabled={order.orderStatus === "Delivered"}
                                                className="flex-1 py-2 text-xs font-semibold text-green-100 bg-green-600 rounded hover:bg-green-500 transition disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                Deliver
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

            </div>
            
            <style jsx="true">{`
                .bg-gray-750 { background-color: #2d3748; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #374151; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #4b5563; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #6b7280; }
            `}</style>
        </div>
    );
}

export default AdminDashboard;
