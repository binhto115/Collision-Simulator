// accounts.js
import express from "express";
import Account from "./models/account-model.js";

const router = express.Router();

// POST /accounts colleciton - create a new account
router.post("/", (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: "Username and password required." });
        }

        // Check if username already exists
        const existing = accounts.find((acc) => acc.username === username);
        if (existing) {
            return res.status(409).json({ message: "Username already exists." });
        }

        // Save new account
        const newAccount = { username, password };
        accounts.push(newAccount);

        console.log("New account created:", newAccount);
        return res.status(201).json({ message: "Account created successfully!" });
    }
    catch (err) {
        console.error("❌ Error creating account:", err);
        return res.status(500).json({ message: "Internal server error." });
    }
});

// GET /accounts - (optional) view all accounts for debugging
router.get("/", (req, res) => {
    res.json(accounts);
});

export default router;
