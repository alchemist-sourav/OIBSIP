const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const bcrypt = require("bcryptjs");

const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const pizzaRoutes = require("./routes/pizzaRoutes");
const orderRoutes = require("./routes/orderRoutes");
const razorpayRoutes = require("./routes/razorpayRoutes");
const userRoutes = require("./routes/userRoutes");
const User = require("./models/User"); // Required for admin seeding

dotenv.config();

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET", "PORT"];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
    console.error(`FATAL ERROR: Missing required environment variables: ${missingEnvVars.join(", ")}`);
    process.exit(1);
}

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
app.use("/api/users", userRoutes);

io.on("connection", (socket) => {
    console.log("User Connected");
});

app.set("io", io);

app.get("/", (req, res) => {
    res.send("Pizza API Running");
});

const PORT = process.env.PORT || 5000;

// Graceful shutdown handling
const gracefulShutdown = () => {
    console.log("Shutting down gracefully...");
    server.close(() => {
        console.log("Closed out remaining connections.");
        mongoose.connection.close(false, () => {
            console.log("MongoDB connection closed.");
            process.exit(0);
        });
    });
};
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Initialize Server
const startServer = async () => {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected Successfully");

        // Seed default admin user if not exists
        const adminEmail = "admin@example.com";
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (!existingAdmin) {
            console.log("No default admin found. Creating one...");
            const hashedPassword = await bcrypt.hash("Admin@123", 10);
            await User.create({
                name: "Admin",
                email: adminEmail,
                password: hashedPassword,
                role: "admin",
                isVerified: true
            });
            console.log("Default admin created successfully: admin@example.com / Admin@123");
        } else {
            console.log("Default admin already exists.");
        }

        server.listen(PORT, () => {
            console.log(`Server Running on Port ${PORT}`);
        });
    } catch (error) {
        console.error("FATAL ERROR: Failed to connect to MongoDB.", error);
        process.exit(1); // Exit process if DB connection fails
    }
};

startServer();