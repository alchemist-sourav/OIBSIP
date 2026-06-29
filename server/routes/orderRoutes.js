const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

const {
    createOrder,
    getOrders,
    updateOrderStatus
} = require("../controllers/orderController");


router.post("/", protect, createOrder);

router.get("/", protect, getOrders);

router.put("/:id", protect, adminOnly, updateOrderStatus);


module.exports = router;