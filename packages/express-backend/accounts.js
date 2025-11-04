// accounts.js
import express from "express";
import "./models/user-services.js";
import Account from "./models/account-model.js";

const router = express.Router();

// POST /accounts colleciton - create a new account
router.post("/", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required." });
        }

        // Check if username already exists
        const existing = await Account.findOne({ username });
        if (existing) {
            return res.status(409).json({ message: "Username already exists." });
        }

        // Save to MongoDB
        const newAccount = new Account({ username, password });
        await newAccount.save();

        console.log("✅ New account created:", newAccount);
        return res.status(201).json({ message: "Account created successfully!" });;
    }
    catch (err) {
        console.error("❌ Error creating account:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// GET /accounts - view all accounts (debugging)
router.get("/", async (req, res) => {
    const accounts = await Account.find({});
    res.json(accounts);
});

export default router;
