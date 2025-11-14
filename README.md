# Collision-Simulator

## Contributing

# To run the website:
- Open a terminal and cd into "express-backend" folder
- run: `npx nodemon backend.js`
- Open another terminal and cd into "react-frontend" folder:
- npm install
- npm install react-icons
- run `npm run dev`

* Run **formatter** before pushing: `npm run format`
* Run **linter**: `npm run lint` 
* Keep PRs small; simple messages like `feat: add table` / `fix: delete bug`

# To use Unix Shell for MongoDB testing:
- run: $ mongosh "mongodb+srv://crashlab-2d-simulation.1keaslo.mongodb.net/" --apiVersion 1 --username <atlas_username>
- login password is the password for the atlas_username, not the atlas account.

### Code style

* **Prettier** formats everything (semicolons on, 2 spaces, width 100)
* **ESLint** for basic JS/React rules

## VS Code setup

1. Install extensions: **Prettier – Code formatter**, **ESLint**
2. Settings → enable **Format on Save**
3. Set default formatter to **Prettier**

Optional workspace settings (`.vscode/settings.json`):

```json
{ "editor.formatOnSave": true, "editor.defaultFormatter": "esben.prettier-vscode" }
```

## Scripts (once `package.json` is added)

```json
{
  "scripts": {
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "lint": "eslint ."
  }
}
```
<img width="2059" height="829" alt="image" src="https://github.com/user-attachments/assets/c83caa9b-38f6-48ec-a0cf-da3df89db2fb" />
<img width="2128" height="1174" alt="image" src="https://github.com/user-attachments/assets/814a0276-fcd3-415c-9628-3be7118a9cfb" />

