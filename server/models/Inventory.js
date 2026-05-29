const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({

    itemName: {
        type: String,
        required: true
    },

    category: {
        type: String,
        required: true
    },

    stock: {
        type: Number,
        required: true
    },

    threshold: {
        type: Number,
        default: 20
    }

},
    {
        timestamps: true
    });

module.exports = mongoose.model(
    "Inventory",
    inventorySchema
);