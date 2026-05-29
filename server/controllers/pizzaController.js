const Pizza = require("../models/Pizza");


// CREATE PIZZA

const createPizza = async (req, res) => {

    try {

        const pizza = await Pizza.create(req.body);

        res.status(201).json(pizza);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// GET ALL PIZZAS

const getPizzas = async (req, res) => {

    try {

        const pizzas = await Pizza.find();

        res.json(pizzas);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {
    createPizza,
    getPizzas
};
