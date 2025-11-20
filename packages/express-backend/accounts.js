// accounts.js
import express from "express";
import "./models/user-services.js";
import Account from "./models/account-model.js";

const router = express.Router();

// POST /accounts collection - create a new account
router.post("/", async (req, res) => {
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

    // Save to MongoDB
    const newAccount = new Account({ username, password: pwd });
    await newAccount.save();

    console.log("New account created:", newAccount);
    return res.status(201).json({ message: "Account created successfully!" });
  } catch (err) {
    console.error("Error creating account:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

// POST /accounts collection - confirm user exists
router.post("/login", async (req, res) => {
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

    if (account.password !== pwd) {
      // Password mismatch
      return res.status(401).json({ message: "Invalid password." });
    }

    // Successful
    return res.status(200).json({ message: "Login successful!", admin: false });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// GET /accounts - view all accounts (debugging)
router.get("/", async (req, res) => {
  const accounts = await Account.find({});
  res.json(accounts);
});

export default router;
