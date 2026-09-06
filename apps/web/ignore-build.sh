#!/bin/bash
# Vercel "Ignored Build Step" for apps/web.
# Skips the build unless something under apps/web itself changed, so a
# commit that only touches apps/web-motion doesn't trigger this project.
#
# Exit 0 = skip build, exit 1 = proceed with build.

ROOT="$(git rev-parse --show-toplevel)"

git diff --quiet HEAD^ HEAD -- "$ROOT/apps/web" 2>/dev/null
STATUS=$?

if [ "$STATUS" -eq 0 ]; then
  echo "No changes in apps/web — skipping build."
  exit 0
fi

echo "Changes detected in apps/web (or no comparable previous commit) — proceeding with build."
exit 1
