const express = require("express");

const mongoose = require("mongoose");

const dotenv = require("dotenv");

const cors = require("cors");

const cookieParser = require("cookie-parser");

const http = require("http");

const { Server } = require("socket.io");


const authRoutes = require("./routes/authRoutes");

const inventoryRoutes = require("./routes/inventoryRoutes");

const pizzaRoutes = require("./routes/pizzaRoutes");

const orderRoutes = require("./routes/orderRoutes");

const razorpayRoutes = require("./routes/razorpayRoutes");


dotenv.config();


const app = express();

const server = http.createServer(app);


const corsOptions = {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
};

const io = new Server(server, {
    cors: corsOptions
});


app.use(cors(corsOptions));

app.use(express.json());

app.use(cookieParser());


app.use("/api/auth", authRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/pizzas", pizzaRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/payment", razorpayRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.log(err));


io.on("connection", (socket) => {

    console.log("User Connected");

});


app.set("io", io);


app.get("/", (req, res) => {
    res.send("Pizza API Running");
});


const PORT = process.env.PORT || 5000;


server.listen(PORT, () => {

    console.log(`Server running on ${PORT}`);

});