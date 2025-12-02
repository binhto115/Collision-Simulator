// accounts.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import express from "express";
import nodemailer from "nodemailer";
import Account from "./models/account-model.js";
import "./models/user-services.js";

import dotenv from "dotenv";
dotenv.config();


const router = express.Router();

// Create transporter for sending email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.RESET_EMAIL,
        pass: process.env.RESET_EMAIL_PASS,
    },
});

// Request Password Email Reset
router.post("/reset-request", async(req, res) => {
    try {
        const { username } = req.body;
        const user = await Account.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: "User not found." })
        }

        // Create a token that expires in 15 minutes
        const resetToken = jwt.sign({ username },
            process.env.RESET_SECRET, { expiresIn: "10m" }
        );
        console.log(resetToken)
        const FRONTEND_URL = process.env.FRONTEND_URL || "https://ashy-sky-0aaa4b51e.3.azurestaticapps.net";

        const resetURL = `${FRONTEND_URL}/reset-password?token=${resetToken}`;
        console.log("RESET_EMAIL:", process.env.RESET_EMAIL);
        console.log("RESET_EMAIL_PASS length:", process.env.RESET_EMAIL_PASS.length);

        // Send email
        transporter.sendMail({
            from: process.env.RESET_EMAIL,
            to: username,
            subject: "SLO 2D CrashLab Simulation Password Reset",
            html: `
        <h3>Password Reset Request</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>This link expires in 10 minutes.</p>
      `,
        }, (err, info) => {
            if (err) {
                console.error("Error sending email:", err);
                return res.status(500).json({ message: "Failed to send reset email.\n" });
            } else {
                console.log("Reset email sent:", info.response);
                return res.json({ message: "Password reset email sent!\n" });
            }
        });

    } catch (err) {
        console.error("Reset request error:", err);
        return res.status(500).json({ message: "Internal server error.\n" });
    }

});

// Password Reset 
router.post("/reset-password", async(req, res) => {
    try {
        const { token, newPassword } = req.body;

        console.log("Received token:", token);

        // Verify token
        const decoded = jwt.verify(token, process.env.RESET_SECRET)

        const user = await Account.findOne({ username: decoded.username });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(newPassword, salt);

        user.password = hashed;
        await user.save();

        res.json({ message: "Pasword updated sucessfully!" });
    } catch (err) {
        console.error("Reset password error:", err);
        return res.status(400).json({ message: "Invalid or expired token." });
    }

});

// POST /accounts collection - create a new account
router.post("/", async(req, res) => {
    try {
        const { username, pwd } = req.body;

        if (!username || !pwd) {
            // Must fill in blank
            return res.status(400).json({ message: "Username and password required." });
        }

        const existing = await Account.findOne({ username });
        if (existing) {
            // Check existing username
            return res.status(409).json({ message: "Username already exists." });
        }

        // ✅ HASH HERE
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(pwd, salt);

        // Save to MongoDB
        const newAccount = new Account({ username, password: hashed });
        await newAccount.save();

        console.log("New account created:", newAccount);
        return res.status(201).json({ message: "Account created successfully!" });
    } catch (err) {
        console.error("Error creating account:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// POST /accounts collection - confirm user exists
router.post("/login", async(req, res) => {
    const { username, pwd } = req.body;

    if (!username || !pwd) {
        return res.status(400).json({ message: "Username and password required." });
    }

    if (username === "admin" && pwd === "1234") {
        console.log("Admin login successful");
        return res.status(200).json({ message: "Admin login successful", admin: true });
    }

    try {
        // Find user in MongoDB
        const account = await Account.findOne({ username });

        if (!account) {
            // Account DNE
            return res.status(404).json({ message: "User not found." });
        }

        // COMPARE HASHED PASSWORD
        const match = await bcrypt.compare(pwd, account.password);
        if (!match) {
            return res.status(401).json({ message: "Invalid password." });
        }

        // if (account.password !== pwd) {
        //     // Password mismatch
        //     return res.status(401).json({ message: "Invalid password." });
        // }

        // Successful
        return res.status(200).json({ message: "Login successful!", admin: false });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

// GET /accounts - view all accounts (debugging)
router.get("/", async(req, res) => {
    const accounts = await Account.find({});
    res.json(accounts);
});

export default router;