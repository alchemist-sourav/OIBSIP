const express = require("express");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

const {
    createPizza,
    getPizzas,
    updatePizza,
    deletePizza
} = require("../controllers/pizzaController");


router.route("/")
    .post(protect, adminOnly, createPizza)
    .get(getPizzas);

router.route("/:id")
    .put(protect, adminOnly, updatePizza)
    .delete(protect, adminOnly, deletePizza);

module.exports = router;