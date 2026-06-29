const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

const {
    createItem,
    getItems,
    updateItemStock
} = require("../controllers/inventoryController");

router.post("/", protect, adminOnly, createItem);

router.get("/", getItems);

router.put("/:id", protect, adminOnly, updateItemStock);

module.exports = router;