---
description: "Commit staged changes without signing and push the current branch"
argument-hint: "Optional: custom commit message"
agent: "agent"
model: "GPT-4.1"
---

# Commit and Push (No Signing)

Complete this operation from the workspace root and do not change directories.

1. Determine the commit message:
   - If the user provides a prompt argument/message, use it exactly.
   - Otherwise generate a concise commit message based on the staged changes.
2. Check repository status and branch first.
3. Commit staged changes with no signing using `--no-gpg-sign`.
   - If there unstaged changes, don't try to stage them.
4. Push to the current branch's remote.
5. Return the branch name and commit hash.

If there is nothing to commit, clearly report that and stop.
