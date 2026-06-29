const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (!token) {
            console.warn("Auth blocked: No token provided");
            return res.status(401).json({ message: "No token provided" });
        }

        if (token.startsWith("Bearer ")) {
            token = token.split(" ")[1];
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Extract full user to ensure they still exist
        const currentUser = await User.findById(decoded.id).select("-password");
        if (!currentUser) {
            console.warn(`Auth blocked: User ID ${decoded.id} no longer exists in DB`);
            return res.status(401).json({ message: "The user belonging to this token does no longer exist." });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        res.status(401).json({ message: "Invalid or expired token" });
    }
};

module.exports = protect;