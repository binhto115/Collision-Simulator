// accounts.js
import express from "express";

const router = express.Router();

// Temporary in-memory "database" for accounts
let accounts = [];

// POST /accounts - create a new account
router.post("/", (req, res) => {
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
});

// GET /accounts - (optional) view all accounts for debugging
router.get("/", (req, res) => {
    res.json(accounts);
});

export default router;
