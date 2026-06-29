const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// REGISTER
const registerUser = async (req, res) => {
    try {
        console.log("Registration attempt...");
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.warn(`Registration failed: User ${email} already exists`);
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            verificationToken
        });

        console.log(`User created in database: ${email}`);

        // Send verification email
        const verifyUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/verify-email/${verificationToken}`;
        const message = `
            <h2>Welcome to Pizza App!</h2>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verifyUrl}" target="_blank">Verify Email</a>
        `;
        
        try {
            await sendEmail({
                email: user.email,
                subject: "Verify your email",
                message
            });
            console.log(`Verification email sent to ${email}`);
            res.status(201).json({ message: "Registration successful! Please check your email to verify your account." });
        } catch (error) {
            console.error(`Failed to send email to ${email}:`, error.message);
            user.verificationToken = undefined;
            await user.save({ validateBeforeSave: false });
            res.status(500).json({ message: "Email could not be sent. User registered but unverified." });
        }
    } catch (error) {
        console.error("Registration error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// LOGIN
const loginUser = async (req, res) => {
    try {
        console.log("Login attempt...");
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            console.warn(`Login failed: User ${email} not found`);
            return res.status(400).json({ message: "User not found" });
        }
        
        if (!user.isVerified && process.env.SKIP_EMAIL_VERIFICATION !== 'true') {
            console.warn(`Login failed: User ${email} is not verified`);
            return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.warn(`Login failed: Invalid credentials for ${email}`);
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        console.log("JWT Generated successfully");
        
        if (user.role === "admin") {
            console.log("Admin Login Successful");
        } else {
            console.log("User Login Successful");
        }
        
        // Remove password before sending to client
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.verificationToken;
        delete userObj.resetPasswordToken;
        delete userObj.resetPasswordExpire;

        res.status(200).json({ message: "Login successful", token, user: userObj });
    } catch (error) {
        console.error("Login error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// VERIFY EMAIL
const verifyEmail = async (req, res) => {
    try {
        console.log("Email verification attempt...");
        const user = await User.findOne({ verificationToken: req.params.token });
        if (!user) {
            console.warn("Email verification failed: Invalid or expired token");
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        
        console.log(`Email verified successfully for user ID: ${user._id}`);
        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        console.error("Email verification error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
    try {
        console.log(`Password reset requested for email: ${req.body.email}`);
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            console.warn(`Password reset failed: No user found for email ${req.body.email}`);
            return res.status(404).json({ message: "There is no user with that email" });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString("hex");

        // Hash token and set to resetPasswordToken field
        const resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 minutes

        await user.save({ validateBeforeSave: false });

        // Send Email
        const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
        const message = `
            <h2>Password Reset Request</h2>
            <p>You requested a password reset. Click the link below to set a new password:</p>
            <a href="${resetUrl}" target="_blank">Reset Password</a>
            <p>This link will expire in 15 minutes.</p>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset Token",
                message
            });
            console.log(`Password reset email sent to ${user.email}`);
            res.status(200).json({ message: "Email sent successfully" });
        } catch (error) {
            console.error(`Failed to send password reset email to ${user.email}:`, error.message);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            res.status(500).json({ message: "Email could not be sent" });
        }
    } catch (error) {
        console.error("Forgot password error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
    try {
        console.log("Password reset confirmation attempt...");
        // Hash the token from URL to compare
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            console.warn("Password reset failed: Invalid or expired token");
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Set new password
        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        console.log(`Password updated successfully for user ID: ${user._id}`);
        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Reset password error:", error.message);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    forgotPassword,
    resetPassword
};