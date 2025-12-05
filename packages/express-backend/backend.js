// backend.js
//  ----How to start mongo----
// sudo pkill -9 mongod
// ps aux | grep mongod
// sudo mongod --dbpath /data/db

// In another terminal:
// mongosh
import express from "express";
import cors from "cors";
import accountsRouter from "./accounts.js";
import { registerUser, loginUser } from "./auth.js";

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use("/accounts", accountsRouter);

// -------------------------
//    PUBLIC AUTH ROUTES
// -------------------------
app.post("/signup", registerUser);
app.post("/login", loginUser);

// -------------------------
//   PROTECTED USER ROUTES
// -------------------------

app.listen(process.env.PORT || port, () => {
    console.log("REST API is listening.");
});

app.get("/", (req, res) => {
    res.send("Backend is running");
});