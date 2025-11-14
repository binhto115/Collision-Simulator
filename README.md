Collision-Simulator
Contributing
To run the website:

Open a terminal and cd into packages/express-backend

run: npx nodemon backend.js

Open another terminal and cd into packages/react-frontend

npm install

npm install react-icons

run npm run dev

Run formatter before pushing: npm run format

Run linter: npm run lint

Keep PRs small; simple messages like feat: add table / fix: delete bug

To use Unix Shell for MongoDB testing:

run:
mongosh "mongodb+srv://crashlab-2d-simulation.1keaslo.mongodb.net/" --apiVersion 1 --username <atlas_username>

login password is the password for the atlas_username, not the atlas account.

Code style

Prettier formats everything (semicolons on, 2 spaces, width 100)

ESLint for basic JS/React rules

VS Code setup

Install extensions: Prettier – Code formatter, ESLint

Settings → enable Format on Save

Set default formatter to Prettier

Optional workspace settings (.vscode/settings.json):

{ "editor.formatOnSave": true, "editor.defaultFormatter": "esben.prettier-vscode" }

Scripts (once package.json is added)
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint ."
  }
}

Access Control (Assignment Deliverables)
Overview

Backend (Express + MongoDB) exposes:

POST /signup → register user, hash password (bcrypt), return JWT

POST /login → verify password, return JWT

GET /users → protected, requires Authorization: Bearer <token>

Frontend (React):

On successful signup/login, store JWT in localStorage under auth_token

All protected fetches add Authorization header from localStorage

Env:

TOKEN_SECRET for JWT

MONGO_URI connection string

Sequence Diagrams
Sign-Up
sequenceDiagram
  autonumber
  actor User
  participant FE as Frontend (React)
  participant BE as Backend (Express)
  participant DB as DB (Mongo)
  User->>FE: Enter username & pwd
  FE->>BE: POST /signup {username, pwd}
  BE->>BE: bcrypt.hash(pwd + salt)
  BE->>DB: INSERT user {username, hashedPwd}
  DB-->>BE: OK
  BE->>BE: jwt.sign({username}, SECRET, exp=1d)
  BE-->>FE: 201 {token}
  FE->>FE: localStorage.setItem('auth_token', token)
  FE-->>User: Signed up (authenticated)

Sign-In
sequenceDiagram
  autonumber
  actor User
  participant FE as Frontend (React)
  participant BE as Backend (Express)
  participant DB as DB (Mongo)
  User->>FE: Enter username & pwd
  FE->>BE: POST /login {username, pwd}
  BE->>DB: Find user by username
  DB-->>BE: {hashedPwd}
  BE->>BE: bcrypt.compare(pwd, hashedPwd)
  alt match
    BE->>BE: jwt.sign({username}, SECRET, exp=1d)
    BE-->>FE: 200 {token}
    FE->>FE: localStorage.setItem('auth_token', token)
    FE-->>User: Logged in
  else mismatch
    BE-->>FE: 401 Unauthorized
  end

Protected API Call
sequenceDiagram
  autonumber
  participant FE as Frontend (React)
  participant MW as Auth Middleware
  participant BE as Backend (Express)
  participant DB as DB (Mongo)
  FE->>FE: token = localStorage.getItem('auth_token')
  FE->>BE: GET /users\nAuthorization: Bearer <token>
  BE->>MW: authenticateUser(req)
  alt valid JWT
    MW-->>BE: next()
    BE->>DB: query users
    DB-->>BE: users
    BE-->>FE: 200 {users_list}
  else invalid/missing
    MW-->>FE: 401 Unauthorized
  end

Backend Endpoints
Method	Path	Auth?	Body	Response
POST	/signup	No	{ "username", "pwd" }	201 { "token": "<jwt>" }
POST	/login	No	{ "username", "pwd" }	200 { "token": "<jwt>" }
GET	/users	Yes	—	200 { "users_list": [...] }

CORS dev setup: FE at http://localhost:5173, BE at http://localhost:8000.

Frontend Notes

JWT is stored in localStorage under auth_token

All protected requests include:

fetch("http://localhost:8000/users", {
  headers: { Authorization: `Bearer ${localStorage.getItem("auth_token")}` }
});

Quick Test (curl)

Unauth check:

curl -i http://localhost:8000/users
# Expect: 401 Unauthorized


Sign up:

curl -i -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"patrick","pwd":"test123"}'
# Copy the "token" from the response


Authenticated call:

TOKEN="<paste the token here>"
curl -i http://localhost:8000/users \
  -H "Authorization: Bearer $TOKEN"
# Expect: 200 with { users_list: [...] }

Troubleshooting

401 on protected routes: check that Authorization: Bearer <token> is present and token is fresh.

CORS errors: backend must allow origin http://localhost:5173 and Authorization header.

Mongo auth error: verify MONGO_URI user/password and database name in .env.

Mermaid not rendering on GitHub: ensure each diagram is in its own fenced block starting with ```mermaid and no extra text inside the fence.
