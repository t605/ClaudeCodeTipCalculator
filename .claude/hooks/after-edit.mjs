// PostToolUse hook for Edit|Write. After a source file under src/ changes:
//   1. format it with Prettier (so the style stays consistent), then
//   2. run the unit tests.
// Both steps are in one script because hooks on the same event run in parallel, and a
// formatter must not rewrite a file while the tests are reading it.
// A test failure is sent back to Claude; a pass shows the user a one-line message.
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'

let raw = ''
process.stdin.setEncoding('utf8')
for await (const chunk of process.stdin) raw += chunk

let input
try {
  input = JSON.parse(raw)
} catch {
  process.exit(0)
}

const file = String(input?.tool_input?.file_path ?? input?.tool_response?.filePath ?? '')
if (!/[\\/]src[\\/].+\.(ts|tsx|css)$/.test(file)) process.exit(0) // not app source: nothing to do

const root = input.cwd || process.cwd()
const bin = (...p) => path.join(root, 'node_modules', ...p)
const run = (script, args, timeout) =>
  spawnSync(process.execPath, [script, ...args], { cwd: root, encoding: 'utf8', timeout })

// 1. Format (skipped if Prettier is not installed; a Prettier error never blocks the edit).
let formatted = ''
const prettier = bin('prettier', 'bin', 'prettier.cjs')
if (existsSync(prettier) && existsSync(file)) {
  const r = run(prettier, ['--write', file], 30_000)
  if (r.status === 0) formatted = 'formatted, '
}

// 2. Tests (skipped if dependencies are not installed).
const vitest = bin('vitest', 'vitest.mjs')
if (!existsSync(vitest)) process.exit(0)
const t = run(vitest, ['run'], 80_000)
const output = `${t.stdout ?? ''}${t.stderr ?? ''}`.replace(/\x1b\[[0-9;]*m/g, '')

if (t.status === 0) {
  const summary = /Tests\s+(.+)/.exec(output)?.[1]?.trim() ?? 'passed'
  process.stdout.write(
    JSON.stringify({ systemMessage: `After edit: ${formatted}tests ${summary}` }),
  )
} else {
  const tail = output.split('\n').slice(-40).join('\n')
  process.stdout.write(
    JSON.stringify({
      decision: 'block',
      reason: `Unit tests failed after editing ${path.basename(file)}. Fix this before continuing:\n${tail}`,
    }),
  )
}
