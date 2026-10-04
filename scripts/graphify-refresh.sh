#!/usr/bin/env bash
# Rebuilds the graphify code graph when code changed since the last rebuild.
# Run by the Claude Code and Codex "Stop" hooks at the end of every agent turn.
# Prints nothing and always exits 0, so it can never block or confuse a hook.

cd "$(dirname "$0")/.." || exit 0
[ -f graphify-out/graph.json ] || exit 0

graphify=$(command -v graphify || echo "$HOME/.local/bin/graphify")
[ -x "$graphify" ] || exit 0

# Fingerprint of every non-ignored code file (path + mtime), so edits,
# new files and deletions all change it.
signature=$(git ls-files -co --exclude-standard -- \
    '*.ts' '*.tsx' '*.js' '*.jsx' '*.mjs' '*.cjs' '*.json' ':!graphify-out' \
  | xargs -d '\n' stat -c '%n %Y' 2>/dev/null | sha1sum | cut -d' ' -f1)
stamp=graphify-out/.code-signature
[ "$signature" = "$(cat "$stamp" 2>/dev/null)" ] && exit 0

# Claude and Codex may finish at the same moment; let only one rebuild run.
exec 9>graphify-out/.refresh.lock
flock -n 9 || exit 0

if "$graphify" update . >graphify-out/.refresh.log 2>&1; then
  echo "$signature" >"$stamp"
fi
exit 0
