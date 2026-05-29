const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        console.log("MongoDB Connected");
        const result = await User.updateMany({}, { isVerified: true });
        console.log(`Updated ${result.modifiedCount} users to be verified.`);
        process.exit(0);
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
