const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Inventory = require("./models/Inventory");

dotenv.config();

const seedItems = [
    { itemName: "Thin Crust", category: "Base", stock: 100, threshold: 20 },
    { itemName: "Hand Tossed", category: "Base", stock: 100, threshold: 20 },
    { itemName: "Cheese Burst", category: "Base", stock: 100, threshold: 20 },
    { itemName: "Stuffed Crust", category: "Base", stock: 100, threshold: 20 },
    { itemName: "Whole Wheat", category: "Base", stock: 100, threshold: 20 },
    
    { itemName: "Tomato", category: "Sauce", stock: 100, threshold: 20 },
    { itemName: "BBQ", category: "Sauce", stock: 100, threshold: 20 },
    { itemName: "Garlic", category: "Sauce", stock: 100, threshold: 20 },
    { itemName: "Pesto", category: "Sauce", stock: 100, threshold: 20 },
    { itemName: "Spicy Marinara", category: "Sauce", stock: 100, threshold: 20 },
    
    { itemName: "Mozzarella", category: "Cheese", stock: 100, threshold: 20 },
    { itemName: "Cheddar", category: "Cheese", stock: 100, threshold: 20 },
    { itemName: "Parmesan", category: "Cheese", stock: 100, threshold: 20 },
    { itemName: "Goat Cheese", category: "Cheese", stock: 100, threshold: 20 },
    { itemName: "Vegan Cheese", category: "Cheese", stock: 100, threshold: 20 },
    
    { itemName: "Onion", category: "Veggie", stock: 100, threshold: 20 },
    { itemName: "Capsicum", category: "Veggie", stock: 100, threshold: 20 },
    { itemName: "Mushroom", category: "Veggie", stock: 100, threshold: 20 },
    { itemName: "Corn", category: "Veggie", stock: 100, threshold: 20 },
    { itemName: "Olive", category: "Veggie", stock: 100, threshold: 20 },
    { itemName: "Jalapeño", category: "Veggie", stock: 100, threshold: 20 },
    { itemName: "Tomato", category: "Veggie", stock: 100, threshold: 20 },
    { itemName: "Paneer", category: "Veggie", stock: 100, threshold: 20 }
];

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("Connected to MongoDB");
        await Inventory.deleteMany();
        await Inventory.insertMany(seedItems);
        console.log("Inventory seeded successfully!");
        process.exit();
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
