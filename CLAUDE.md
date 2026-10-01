# CLAUDE.md - Claude Code Tip Calculator

## What it is
A small web app (Vite + React + TypeScript) that calculates tip amount, total and per-person share from a bill and a tip percentage. Layout follows the owner's screenshot: one card with Bill, Tip, Tip amount, Total. Extras: currency select, tip presets, collapsible split section (number of people, tip per person, total per person), footer buttons Share result / Reload calculator / Clear all changes (back to defaults), dark mode.

## Decisions (do not "correct")
- Calculation logic lives in `src/calc.ts` (pure, unit-tested); the UI only calls it.
- Numbers use a dot everywhere (`32.10`), inputs and results alike (course lesson "See How to Fix Bugs"). Inputs are native `type=number` fields with `min`/`max`/`step`; `limitInput` in `src/calc.ts` rejects changes that break the rules (bill <= 100000 with 2 decimals, tip 0-100 whole, people 2-50 whole).
- Reset state: bill and tip empty (shown as 0), 2 people, split section hidden. Title sits above the card.
- Tip amount and Total are read-only outputs, never editable.
- No UI library and no state library: plain React state and plain CSS with variables (light/dark via `prefers-color-scheme`).
- This is a Node project, so the Python `.bat` launcher / release-zip pattern from the shared CLAUDE.md does not apply.

## Files
- `src/calc.ts`, `src/calc.test.ts` - logic, input rules and tests (no React)
- `src/constants.ts` - currencies, tip presets, reset defaults
- `src/App.tsx`, `src/App.css` - state and page layout only
- `src/components/<Name>/` - one folder per component, each with `<Name>.tsx`, `<Name>.css` (if styled) and `index.ts`:
  Field (label + box), NumberField (input rules, key blocking), ResultField, CurrencySelect,
  TipPresets, SplitSection, Actions (share / reload / clear)
- `index.html`, `vite.config.ts`, `tsconfig.json`, `package.json`
- Refactor rule: class names and DOM output stay the same unless a change is intended; compare the rendered HTML and computed styles before and after.

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

## QA checklist (the personal `qa-reviewer` agent reads this section)
- Inputs: bill 0-100000 with at most 2 decimals; tip whole number 0-100; people whole number 2-50. Invalid input is ignored, never accepted. No leading zeros.
- Results use a dot and exactly two decimals (`32.10`); half a cent rounds up. Tip amount and Total are read-only.
- Reset state: bill and tip empty, 2 people, split section hidden, PLN.
- Share text mentions the split only when the split section is open.
- Accessibility and layout: every field has a linked label; buttons, dropdowns and presets are at least 44px tall; light and dark mode stay readable; no horizontal scroll down to 320px.
- Calculation and input rules live in `src/calc.ts` and are unit-tested; the PWA files and the GitHub Actions deploy must keep working.
- Already reviewed and deliberately left: per-person amounts are rounded separately and may differ from the total by a few cents; the "Reload calculator" button overlaps with "Clear all changes" (it follows the owner's screenshot).
- Review with the project's own commands: `npm test`, `npx tsc -b`.

## Hooks (`.claude/settings.json`, scripts in `.claude/hooks/`)
- `block-dangerous.mjs` (PreToolUse, Bash): denies force-push, `git push ... main` (it deploys the live site), `git reset --hard`, `git clean -f`, recursive deletes. Michael runs those himself if truly needed.
- `protect-main.mjs` (PreToolUse, Edit|Write): denies edits while the checked-out branch is `main`. Work on `Learning-Branch`.
- `after-edit.mjs` (PostToolUse, Edit|Write): after an edit under `src/`, formats the file with Prettier, then runs `vitest`; a failure is sent back to Claude. Formatting and tests are one script because hooks on the same event run in parallel.
- `notify.mjs` (Notification and Stop): plays a Windows sound and shows a toast when Claude needs input or finishes. Remove the `Stop` entry if it is too frequent.
- Prettier config: `.prettierrc.json` (no semicolons, single quotes, width 100, `endOfLine: auto` because Windows checkouts use CRLF). `npm install` provides it; hooks skip it if missing.
- The scripts are plain Node (no jq). To disable one, remove its entry from `.claude/settings.json`.
- Hooks load at session start: a new session is needed after changing `settings.json`.

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
