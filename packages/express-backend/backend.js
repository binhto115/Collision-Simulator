// backend.js
//  ----How to start mongo----
// sudo pkill -9 mongod
// ps aux | grep mongod
// sudo mongod --dbpath /data/db

// In another terminal: 
// mongosh
import express from "express";
import cors from "cors";
import userService from "./models/user-services.js";
import accountsRouter from "./accounts.js";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use("/accounts", accountsRouter);

app.listen(port, () => {
    console.log(
        `Example app listening at http://localhost:${port}/users`
    );
});

// POST: Add a new user with random ID
app.post("/users", (req, res) => {
    const userToAdd = req.body;

    userService.addUser(userToAdd)
        .then(newUser => res.status(201).json(newUser))
        .catch(err => res.status(400).send(err.message));
});

// DELETE:
app.delete("/users/:id", (req, res) => {
    const id = req.params["id"];

    userService.findUserByIdAndDeleteIt(id)
        .then((deletedUser) => {
            if (!deletedUser) {
                return res.status(404).send("Resource not found\n");
            }
            res.status(204).end();
        })
        .catch(err => res.status(400).send(err.message));
});

// GET by ID
app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    userService.findUserById(id)
        .then(user => {
            if (!user) {
                return res.status(404).send("Resource not found\n");
            }
            res.json(user);
        })
        .catch(err => res.status(500).send(err.message));
});

app.get("/users", (req, res) => {
    const { name, job } = req.query;

    let promise;
    if (name && job) {
        promise = userService.findUserByNameAndJob(name, job);
    } else if (name) {
        promise = userService.findUserByName(name);
    } else if (job) {
        promise = userService.findUserByJob(job);
    } else {
        promise = userService.getUsers(); // all users
    }

    promise
        .then(users => {
            if (!users || users.length === 0) {
                return res.status(404).send("Resource not found\n");
            }
            res.json({ users_list: users });
        })
        .catch(err => res.status(500).send(err.message));
});