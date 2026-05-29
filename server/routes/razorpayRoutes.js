const express = require("express");
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment } = require("../controllers/razorpayController");

router.post("/orders", createRazorpayOrder);
router.post("/verify", verifyRazorpayPayment);

module.exports = router;
