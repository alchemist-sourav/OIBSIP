const Pizza = require("../models/Pizza");

// CREATE PIZZA (Admin Only)
const createPizza = async (req, res) => {
    try {
        const pizza = await Pizza.create(req.body);
        res.status(201).json(pizza);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET ALL PIZZAS
const getPizzas = async (req, res) => {
    try {
        const pizzas = await Pizza.find();
        res.json(pizzas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE PIZZA (Admin Only)
const updatePizza = async (req, res) => {
    try {
        const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!pizza) {
            return res.status(404).json({ message: "Pizza not found" });
        }
        res.json(pizza);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE PIZZA (Admin Only)
const deletePizza = async (req, res) => {
    try {
        const pizza = await Pizza.findByIdAndDelete(req.params.id);
        if (!pizza) {
            return res.status(404).json({ message: "Pizza not found" });
        }
        res.json({ message: "Pizza deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPizza,
    getPizzas,
    updatePizza,
    deletePizza
};
