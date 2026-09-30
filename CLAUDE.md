# CLAUDE.md - Claude Code Tip Calculator

## What it is
A small web app (Vite + React + TypeScript) that calculates tip amount, total and per-person share from a bill and a tip percentage. Layout follows the owner's screenshot: one card with Bill, Tip, Tip amount, Total. Extras: currency select, tip presets, collapsible split section (number of people, tip per person, total per person), footer buttons Share result / Reload calculator / Clear all changes (back to defaults), dark mode.

## Decisions (do not "correct")
- Calculation logic lives in `src/calc.ts` (pure, unit-tested); the UI only calls it.
- Numbers are shown with two decimals and a comma (`32,10`). Input accepts comma or dot and strips other characters.
- Tip amount and Total are read-only outputs, never editable.
- No UI library and no state library: plain React state and plain CSS with variables (light/dark via `prefers-color-scheme`).
- This is a Node project, so the Python `.bat` launcher / release-zip pattern from the shared CLAUDE.md does not apply.

## Files
- `src/calc.ts`, `src/calc.test.ts` - logic and tests
- `src/App.tsx`, `src/App.css`, `src/index.css` - UI
- `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`

## Running
Needs Node.js (nodejs.org). `npm install`, then `npm run dev` (http://localhost:5173).
A terminal opened before Node was installed will not find `npm`; open a new one.

## Testing
`npm test` (Vitest), `npx tsc -b`, `npx vite build`. The UI was checked by hand in a browser at 375px and desktop width in light and dark mode; not tested on a real phone.

## Publishing
- Installable PWA via `vite-plugin-pwa` (manifest + service worker generated at build). `base: './'` in `vite.config.ts` so it works under a GitHub Pages sub-path.
- Icons in `public/` are a generated neutral "%" tile, not the owner's logo: the project is public and the logo file is only 93x66 px.
- `.github/workflows/deploy.yml` tests, builds and deploys to GitHub Pages on push to `main`.
- Service-worker registration could not be verified in the built-in preview browser (it refuses to register one); test install and offline on a real phone after publishing.

## Git
Repository initialised locally (branch `main`). Publish with GitHub Desktop; `git` is also at /mingw64/bin.

## Prompt for a similar project
Reusable template (fill the <...>); from the wrap-up of this project on 2026-09-30.

```text
Create <app name> with <stack/template> in <exact folder>.
Purpose/audience: <private | public lesson | for users>. Data rules: <none | no logo | no keys>.
Screens to match: <attached screenshots, one per section>.
Behaviour: <what is editable, what is calculated, example input -> exact output>.
Extras: <list all features now, including reset/share/dark mode/PWA>.
Publish: <where, how, who does which step>.
Work rules: check tools installed first (Node etc.; I open a NEW terminal after
installing); logic in a tested module; verify in a browser; list what was NOT tested.
```

What cost the most rounds last time, and the sentence that prevents it:
- Node not installed / old terminal -> "Check Node first and tell me."
- Wrong folder, stray duplicate -> give the exact target folder.
- Features arriving one by one -> list all features and all screenshots up front.
- Stray pasted text -> re-read pasted text from lessons before sending.
- GitHub Pages: set Source = GitHub Actions BEFORE the first push; Pages is in the
  repository Settings, not the account settings.
- Public repo -> neutral generated icon, not a personal logo.
