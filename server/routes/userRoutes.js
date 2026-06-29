const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const router = express.Router();
const { getUsers, updateUserRole, deleteUser } = require("../controllers/userController");

// All user management routes require admin access
router.use(protect, adminOnly);

router.route("/")
    .get(getUsers);

router.route("/:id")
    .put(updateUserRole)
    .delete(deleteUser);

module.exports = router;
