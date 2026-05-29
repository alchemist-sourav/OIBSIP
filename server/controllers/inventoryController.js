const Inventory = require("../models/Inventory");


// CREATE ITEM

const createItem = async (req, res) => {

    try {

        const item = await Inventory.create(req.body);

        res.status(201).json(item);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// GET ALL ITEMS

const getItems = async (req, res) => {

    try {

        const items = await Inventory.find();

        res.json(items);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// UPDATE ITEM STOCK
const updateItemStock = async (req, res) => {
    try {
        const { id } = req.params;
        const { stock } = req.body;
        const item = await Inventory.findByIdAndUpdate(
            id,
            { stock },
            { new: true }
        );
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createItem,
    getItems,
    updateItemStock
};