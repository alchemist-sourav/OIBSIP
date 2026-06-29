const adminOnly = (req, res, next) => {
    if (req.user.role !== "admin") {
        console.warn(`Admin access denied for user: ${req.user.email} (ID: ${req.user._id})`);
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
};

module.exports = adminOnly;