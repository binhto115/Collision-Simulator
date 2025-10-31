# Collision-Simulator

## Contributing

# To run the website:
- Open a terminal and cd into "express-backend" folder
- run: npx nodemon backend.js
- Open another terminal and cd into "react-frontend" folder
- run npm run dev

* Run **formatter** before pushing: `npm run format`
* Run **linter**: `npm run lint` 
* Keep PRs small; simple messages like `feat: add table` / `fix: delete bug`

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
