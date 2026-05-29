const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    pizza: {

        base: String,

        sauce: String,

        cheese: String,

        veggies: [String]

    },

    totalPrice: {
        type: Number,
        default: 299
    },

    paymentStatus: {
        type: String,
        default: "Pending"
    },

    orderStatus: {
        type: String,
        enum: [
            "Order Received",
            "In Kitchen",
            "Sent To Delivery",
            "Delivered"
        ],
        default: "Order Received"
    }

},
    {
        timestamps: true
    });

module.exports = mongoose.model(
    "Order",
    orderSchema
);