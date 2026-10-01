// PreToolUse hook for Edit|Write: refuses file edits while the checked-out branch
// is "main", because pushing main deploys the live site. Work on Learning-Branch
// (or another branch) instead. If git cannot be run, the hook lets the edit through.
import { execFileSync } from 'node:child_process'

let raw = ''
process.stdin.setEncoding('utf8')
for await (const chunk of process.stdin) raw += chunk

let input
try {
  input = JSON.parse(raw)
} catch {
  process.exit(0)
}

const cwd = input.cwd || process.cwd()
let branch = ''
try {
  branch = execFileSync('git', ['branch', '--show-current'], { cwd, encoding: 'utf8' }).trim()
} catch {
  process.exit(0) // not a git repo, or git not found: do not block
}

if (branch === 'main') {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason:
          'Blocked by .claude/hooks/protect-main.mjs: the branch is "main", which deploys the live site. Switch to Learning-Branch (GitHub Desktop > Current branch) and try again.',
      },
    }),
  )
}
