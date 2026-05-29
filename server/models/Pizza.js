const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    bases: [String],

    sauces: [String],

    cheeses: [String],

    veggies: [String],

    price: {
        type: Number,
        required: true
    }

},
    {
        timestamps: true
    });

module.exports = mongoose.model(
    "Pizza",
    pizzaSchema
);