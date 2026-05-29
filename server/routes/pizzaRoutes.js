const express = require("express");

const router = express.Router();

const {
    createPizza,
    getPizzas
} = require("../controllers/pizzaController");


router.post("/", createPizza);

router.get("/", getPizzas);


module.exports = router;