# Collision-Simulator ## Contributing # To run the website: - Open a terminal and cd into "express-backend" folder - run: npx nodemon backend.js - Open another terminal and cd into "react-frontend" folder: - npm install - npm install react-icons - run npm run dev * Run **formatter** before pushing: npm run format * Run **linter**: npm run lint * Keep PRs small; simple messages like feat: add table / fix: delete bug # To use Unix Shell for MongoDB testing: - run: $ mongosh "mongodb+srv://crashlab-2d-simulation.1keaslo.mongodb.net/" --apiVersion 1 --username <atlas_username> - login password is the password for the atlas_username, not the atlas account. ### Code style * **Prettier** formats everything (semicolons on, 2 spaces, width 100) * **ESLint** for basic JS/React rules ## VS Code setup 1. Install extensions: **Prettier – Code formatter**, **ESLint** 2. Settings → enable **Format on Save** 3. Set default formatter to **Prettier** Optional workspace settings (.vscode/settings.json):
json
{ "editor.formatOnSave": true, "editor.defaultFormatter": "esben.prettier-vscode" }
## Scripts (once package.json is added)
json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint ."
  }
}
### Access Control – Sequence Diagrams #### Sign-Up
mermaid
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
    BE->>BE: jwt.sign(payload)
    BE-->>FE: 200 {token}
    FE->>FE: localStorage.setItem('auth_token', token)
  else mismatch
    BE-->>FE: 401 Unauthorized
  end

sequenceDiagram
  autonumber
  participant FE as Frontend (React)
  participant BE as Backend (Express)
  participant MW as Auth Middleware
  participant DB as DB (Mongo)
  FE->>FE: token = localStorage.getItem('auth_token')
  FE->>BE: GET /users (Authorization: Bearer token)
  BE->>MW: authenticateUser
  alt valid JWT
    MW-->>BE: next()
    BE->>DB: query users
    DB-->>BE: users
    BE-->>FE: 200 {users_list}
  else invalid/missing
    MW-->>FE: 401 Unauthorized
  end
