import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

let users = []; // in-memory to start

app.get("/", (_req, res) => res.send("Hello World!"));

app.get("/users", (req, res) => {
  const { name, job } = req.query;
  let result = users;
  if (name) result = result.filter((u) => u.name === name);
  if (job) result = result.filter((u) => u.job === job);
  res.send({ users_list: result });
});

app.get("/users/:id", (req, res) => {
  const found = users.find((u) => u.id === req.params.id);
  if (!found) return res.status(404).send("Resource not found.");
  res.send(found);
});

app.post("/users", (req, res) => {
  const { name = "", job = "" } = req.body || {};
  const user = { id: Math.random().toString(36).slice(2, 10), name, job };
  users.push(user);
  res.status(201).send(user);
});

app.delete("/users/:id", (req, res) => {
  const before = users.length;
  users = users.filter((u) => u.id !== req.params.id);
  if (users.length === before) return res.status(404).send("Resource not found.");
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
