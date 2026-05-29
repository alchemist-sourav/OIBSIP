const adminOnly = require("../middleware/adminMiddleware");
const protect = require("../middleware/authMiddleware");
const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyEmail,
    forgotPassword,
    resetPassword
} = require("../controllers/authController");


router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);
router.get("/", (req, res) => {
    res.send("Auth Route Working");
});

router.get("/dashboard", protect, (req, res) => {

    res.json({
        message: "Protected Dashboard",
        user: req.user
    });

});

router.get(
    "/admin",
    protect,
    adminOnly,
    (req, res) => {

        res.json({
            message: "Welcome Admin"
        });

    }
);

module.exports = router;