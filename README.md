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
- Bill (0-100000, max 2 decimals), Tip (whole number 0-100) and Number of people (whole number 2-50) are native number fields; invalid input is ignored. Tip amount and Total are calculated.
- Currency selector (PLN, EUR, USD, GBP, HUF, ILS, CZK, CHF), tip presets (5/10/15/20%).
- Collapsible "Are you splitting the bill?" section (hidden by default): tip per person and total per person.
- Footer buttons: Share result (system share sheet, or copies a summary), Reload calculator, Clear all changes (back to the empty reset state, 2 people, split section hidden).
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
