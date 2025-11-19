// backend.js
//  ----How to start mongo----
// sudo pkill -9 mongod
// ps aux | grep mongod
// sudo mongod --dbpath /data/db
// In another terminal: mongosh

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userService from "./models/user-services.js";
import accountsRouter from "./accounts.js";
import { registerUser, loginUser, authenticateUser } from "./auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

/* -------------------- Middleware -------------------- */
app.use(express.json());
app.use(
  cors({
    origin: "https://black-forest-022bc951e.3.azurestaticapps.net", // Changed to be deployed front end (can add local for faster testing)
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Express 5: avoid app.options('*', ...) — handle preflight generically
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});


/* -------------------- Routers -------------------- */
app.use("/accounts", accountsRouter);

/* -------------------- Public auth routes -------------------- */
app.post("/signup", registerUser);
app.post("/login", loginUser);

/* -------------------- Protected user routes -------------------- */
// POST: Add a new user with random ID
app.post("/users", authenticateUser, (req, res) => {
  const userToAdd = req.body;
  userService
    .addUser(userToAdd)
    .then((newUser) => res.status(201).json(newUser))
    .catch((err) => res.status(400).send(err.message));
});

// DELETE: remove by id
app.delete("/users/:id", authenticateUser, (req, res) => {
  const id = req.params["id"];
  userService
    .findUserByIdAndDeleteIt(id)
    .then((deletedUser) => {
      if (!deletedUser) return res.status(404).send("Resource not found\n");
      res.status(204).end();
    })
    .catch((err) => res.status(400).send(err.message));
});

// GET by ID
app.get("/users/:id", authenticateUser, (req, res) => {
  const id = req.params["id"];
  userService
    .findUserById(id)
    .then((user) => {
      if (!user) return res.status(404).send("Resource not found\n");
      res.json(user);
    })
    .catch((err) => res.status(500).send(err.message));
});

// GET list (with optional filters)
app.get("/users", authenticateUser, (req, res) => {
  const { name, job } = req.query;

  let promise;
  if (name && job) promise = userService.findUserByNameAndJob(name, job);
  else if (name)  promise = userService.findUserByName(name);
  else if (job)   promise = userService.findUserByJob(job);
  else            promise = userService.getUsers();

  promise
    .then((users) => {
      if (!users || users.length === 0) {
        return res.status(404).send("Resource not found\n");
      }
      res.json({ users_list: users });
    })
    .catch((err) => res.status(500).send(err.message));
});

/* -------------------- Start server -------------------- */
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
