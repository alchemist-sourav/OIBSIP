const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // Check if using default placeholder credentials
    if (!process.env.EMAIL_USER || process.env.EMAIL_USER === "your_email@gmail.com") {
        console.warn("⚠️ Warning: EMAIL_USER is not configured in .env. Simulating email sending...");
        console.log("---------------------------------------------------------");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log(`Message: \n${options.message}`);
        console.log("---------------------------------------------------------");
        return; // Simulate success
    }

    // Create a transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: `Pizza App <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        html: options.message
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
