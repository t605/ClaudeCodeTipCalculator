# Claude Code Tip Calculator

Enter a bill and a tip percentage; the tip amount, total and per-person share update as you type.

## Run
1. Install Node.js from https://nodejs.org (open a new terminal afterwards).
2. In this folder:

```
npm install
npm run dev
```

3. Open http://localhost:5173.

## Other commands
- `npm test` - run unit tests
- `npm run build` - type-check and build to `dist/`

## Features
- Bill and Tip are editable (comma or dot decimals); Tip amount and Total are calculated.
- Currency selector (PLN, EUR, USD, GBP, HUF, ILS, CZK, CHF), tip presets (5/10/15/20%).
- Collapsible "Are you splitting the bill?" section: number of people (1-99) gives tip per person and total per person.
- Footer buttons: Share result (system share sheet, or copies a summary), Reload calculator (reloads the page), Clear all changes (back to defaults: 321,00 PLN, 10%, 2 people).
- Dark mode; works from 320px wide.

## Install as an app (PWA)
Open the published site on your phone or PC, then:
- Android / Chrome / Edge: menu > "Install app" (or "Add to Home screen").
- iPhone: Safari > Share > "Add to Home Screen".

## Publish on GitHub Pages
1. Publish this folder as a public repository (GitHub Desktop: Publish repository).
2. On GitHub: Settings > Pages > Source: "GitHub Actions".
3. Every push to `main` runs tests, builds and deploys. The site is at
   `https://<your-username>.github.io/<repository-name>/`.
