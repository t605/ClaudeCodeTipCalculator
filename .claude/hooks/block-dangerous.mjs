// PreToolUse hook for Bash: stops commands that are hard to undo or that would
// deploy the live site. Reads the hook JSON from stdin; prints a "deny" decision
// as JSON to block, or prints nothing to let the command through.

const RULES = [
  {
    test: /\bgit\s+push\b[^\n]*(--force\b|--force-with-lease\b|\s-f\b)/,
    why: 'Force-pushing can overwrite history on GitHub.',
  },
  {
    test: /\bgit\s+push\b[^\n]*(\s|:)main\b/,
    why: 'Pushing main deploys the live site. Push main yourself from GitHub Desktop.',
  },
  {
    test: /\bgit\s+reset\s+--hard\b/,
    why: 'git reset --hard throws away uncommitted work.',
  },
  {
    test: /\bgit\s+clean\b[^\n]*-[a-zA-Z]*f/,
    why: 'git clean -f deletes untracked files permanently.',
  },
  {
    test: /\brm\s+(-[a-zA-Z]*[rR][a-zA-Z]*|--recursive)\b/,
    why: 'Recursive delete (rm -r / rm -rf).',
  },
  {
    test: /\bRemove-Item\b[^\n]*-Recurse\b/i,
    why: 'Recursive delete (Remove-Item -Recurse).',
  },
]

let raw = ''
process.stdin.setEncoding('utf8')
for await (const chunk of process.stdin) raw += chunk

let command = ''
try {
  command = JSON.parse(raw)?.tool_input?.command ?? ''
} catch {
  process.exit(0) // unreadable input: do not block
}

const hit = RULES.find((r) => r.test.test(command))
if (hit) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'deny',
        permissionDecisionReason: `Blocked by .claude/hooks/block-dangerous.mjs: ${hit.why} Ask the user to run it themselves if it is really needed.`,
      },
    }),
  )
}
