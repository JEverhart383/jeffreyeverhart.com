#!/bin/bash
# Vercel "Ignored Build Step" for apps/web-motion.
# Skips the build unless something under apps/web-motion itself changed, so a
# commit that only touches apps/web doesn't trigger this project.
#
# Exit 0 = skip build, exit 1 = proceed with build.

ROOT="$(git rev-parse --show-toplevel)"

git diff --quiet HEAD^ HEAD -- "$ROOT/apps/web-motion" 2>/dev/null
STATUS=$?

if [ "$STATUS" -eq 0 ]; then
  echo "No changes in apps/web-motion — skipping build."
  exit 0
fi

echo "Changes detected in apps/web-motion (or no comparable previous commit) — proceeding with build."
exit 1
