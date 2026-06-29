const express = require("express");
const protect = require("../middleware/authMiddleware");
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment } = require("../controllers/razorpayController");

router.post("/orders", protect, createRazorpayOrder);
router.post("/verify", protect, verifyRazorpayPayment);

module.exports = router;
