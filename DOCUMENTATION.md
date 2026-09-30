# Claude Code Tip Calculator - Documentation

## 1. Project overview
A small web app that calculates the tip, the total and each person's share of a
restaurant bill. It was built as a learning project with Claude Code. It runs in
any browser and can be installed on a phone or PC as an app (PWA). There is no
server, no account and no data is stored or sent anywhere.

Live site: https://t605.github.io/ClaudeCodeTipCalculator/

## 2. Main features
- Enter the bill and a tip percentage; the tip amount and total update as you type.
- Currency label: PLN, EUR, USD, GBP, HUF, ILS, CZK, CHF (labels only, no conversion).
- Tip presets: 5%, 10%, 15%, 20%.
- Collapsible "Are you splitting the bill?" section: number of people, tip per
  person and total per person.
- Input rules: bill 0-100000 with up to 2 decimals, tip a whole number 0-100,
  people a whole number 2-50. Invalid input is ignored.
- Footer buttons: Share result, Reload calculator, Clear all changes.
- Light and dark mode (follows the device), responsive from 320 px wide.
- Installable and works offline (PWA).

## 3. Technical stack
| Tool | Used for |
|---|---|
| React 19 | User interface (function components, `useState`) |
| TypeScript (strict) | Type checking |
| Vite 6 | Dev server and production build |
| vite-plugin-pwa | Web app manifest and service worker (installable, offline) |
| Vitest | Unit tests |
| Plain CSS with variables | Styling; one CSS file per component |
| GitHub Actions + GitHub Pages | Test, build and publish on every push to `main` |

No UI, state or number-formatting libraries are used.

## 4. File structure
```text
.
├── .github/workflows/deploy.yml   Test, build and deploy to GitHub Pages
├── public/                        App icons and favicon
├── src/
│   ├── main.tsx                   Entry point, mounts <App />
│   ├── App.tsx / App.css          State and page layout
│   ├── calc.ts                    Calculation and input rules (no React)
│   ├── calc.test.ts               Unit tests for calc.ts
│   ├── constants.ts               Currencies, tip presets, reset defaults
│   ├── index.css                  Colours (light/dark) and base styles
│   └── components/                One folder per component
│       ├── Field/                 Label + rounded box, used by every field
│       ├── NumberField/           Number input that enforces the limits
│       ├── ResultField/           Read-only calculated value
│       ├── CurrencySelect/        Currency dropdown
│       ├── TipPresets/            The 5/10/15/20% buttons
│       ├── SplitSection/          Collapsible split-the-bill section
│       └── Actions/               Share, reload and clear buttons
├── index.html                     Page shell and PWA meta tags
├── vite.config.ts                 Vite + PWA configuration
├── tsconfig.json                  TypeScript settings
├── package.json                   Scripts and dependencies
├── README.md                      Short intro for visitors
├── CLAUDE.md                      Notes for Claude Code (decisions, structure)
└── DOCUMENTATION.md               This file
```
Each component folder contains `<Name>.tsx`, an optional `<Name>.css` and an
`index.ts` that re-exports the component.

## 5. Setup instructions
**Prerequisite:** Node.js (the deploy workflow uses version 22) with npm.
Download it from https://nodejs.org. After installing, open a **new** terminal
so `npm` is found.

```bash
cd ClaudeCodeTipCalculator
npm install
npm run dev
```
Open the address printed by Vite, normally http://localhost:5173.

## 6. Main scripts (from package.json)
| Script | Command run | What it does |
|---|---|---|
| `npm run dev` | `vite` | Starts the dev server with hot reload |
| `npm run build` | `tsc -b && vite build` | Type-checks, then builds to `dist/` (also generates the service worker) |
| `npm run preview` | `vite preview` | Serves the built `dist/` folder locally |
| `npm test` | `vitest run` | Runs the unit tests once |

## 7. How to run tests
```bash
npm test
```
- **Covered:** everything in `src/calc.ts`: number parsing, the input limits
  (`limitInput`), rounding and formatting (`formatAmount`), the people count
  and the tip and total calculations, including the half-cent rounding case.
- **Not covered:** the React components and the page itself. There are no UI
  tests; the layout and behaviour were checked by hand in a browser.
- **Also run before publishing:** `npx tsc -b` and `npm run build`.
  The deploy workflow runs `npm ci`, `npm test` and `npm run build`, and only
  publishes if all three pass.

## 8. Publishing
Pushing to the `main` branch triggers `.github/workflows/deploy.yml`, which
deploys the `dist/` build to GitHub Pages. In the repository settings,
Pages > Source must be set to "GitHub Actions". Other branches are not deployed.
