const Order = require("../models/Order");

const Inventory = require("../models/Inventory");


// CREATE ORDER

const createOrder = async (req, res) => {

    try {

        const { pizza, totalPrice } = req.body;


        const sendEmail = require("../utils/sendEmail");

        const updateAndCheckStock = async (itemName) => {
            if (!itemName) return;
            const updatedItem = await Inventory.findOneAndUpdate(
                { itemName },
                { $inc: { stock: -1 } },
                { new: true }
            );
            
            if (updatedItem && updatedItem.stock <= updatedItem.threshold) {
                const message = `<p>Alert: The stock for <strong>${itemName}</strong> has fallen to <strong>${updatedItem.stock}</strong>. Please restock immediately.</p>`;
                try {
                    await sendEmail({
                        email: process.env.EMAIL_USER || "admin@pieza.com",
                        subject: `Low Stock Alert: ${itemName}`,
                        message,
                    });
                } catch (e) {
                    console.log("Failed to send stock alert email", e);
                }
            }
        };

        await updateAndCheckStock(pizza.base);
        await updateAndCheckStock(pizza.sauce);
        await updateAndCheckStock(pizza.cheese);

        for (const veggie of pizza.veggies) {
            await updateAndCheckStock(veggie);
        }


        const order = await Order.create({
            pizza,
            totalPrice,
            paymentStatus: req.body.paymentStatus || "Pending"
        });


        res.status(201).json(order);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// GET ORDERS

const getOrders = async (req, res) => {

    try {

        const orders = await Order.find();

        res.json(orders);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// UPDATE ORDER STATUS

const updateOrderStatus = async (req, res) => {

    try {

        const { id } = req.params;

        const { orderStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            id,
            { orderStatus },
            { new: true }
        );


        // SOCKET.IO REALTIME UPDATE

        const io = req.app.get("io");

        io.emit("statusUpdated", order);


        res.json(order);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



module.exports = {

    createOrder,

    getOrders,

    updateOrderStatus

};