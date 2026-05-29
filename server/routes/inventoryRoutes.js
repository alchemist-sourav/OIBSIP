const express = require("express");

const router = express.Router();

const {
    createItem,
    getItems,
    updateItemStock
} = require("../controllers/inventoryController");


// TEMP TEST ROUTES

router.post("/", createItem);

router.get("/", getItems);

router.put("/:id", updateItemStock);

module.exports = router;