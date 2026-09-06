#!/bin/bash
# Vercel "Ignored Build Step" for apps/web-motion.
# Skips the build unless something under apps/web-motion itself changed, or
# a shared workspace file (root package.json / pnpm-lock.yaml /
# pnpm-workspace.yaml) did — so a commit that only touches apps/web
# doesn't trigger this project.
#
# Exit 0 = skip build, exit 1 = proceed with build.

ROOT="$(git rev-parse --show-toplevel)"

git diff --quiet HEAD^ HEAD -- \
  "$ROOT/apps/web-motion" \
  "$ROOT/package.json" \
  "$ROOT/pnpm-lock.yaml" \
  "$ROOT/pnpm-workspace.yaml" \
  2>/dev/null
STATUS=$?

if [ "$STATUS" -eq 0 ]; then
  echo "No changes in apps/web-motion or shared workspace config — skipping build."
  exit 0
fi

echo "Changes detected in apps/web-motion or shared workspace config (or no comparable previous commit) — proceeding with build."
exit 1
