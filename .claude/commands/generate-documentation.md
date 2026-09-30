---
description: Generate DOCUMENTATION.md for this project from the real code
---

Generate a file named DOCUMENTATION.md in the project root, based only on what
is actually in this code base (read package.json, the config files and the
source before writing; do not guess).

Include these sections, in this order:
1. Project overview (2-4 sentences: what it is and who it is for)
2. Main features (short bullet list)
3. Technical stack (name each tool and what it is used for)
4. File structure (a tree of the important files and folders, one line each)
5. Setup instructions (prerequisites, install, run; exact commands)
6. Main scripts from package.json (a table: script, command, what it does)
7. How to run tests (the command, what is covered, and what is NOT covered)

Rules:
- Keep it clear and practical: short sentences, exact commands, no marketing text.
- Every command, file name and script must exist in the project; verify them.
- Do not invent features, versions or folders. If something is unknown, leave it out.
- Do not change any other file. If DOCUMENTATION.md already exists, update it
  and keep anything that is still correct.
- At the end, tell me what you checked and anything you could not verify.
