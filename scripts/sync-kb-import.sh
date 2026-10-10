#!/usr/bin/env bash
# Refresh vendored KB JSON from a local DogResearch checkout or clone.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
DEST="$ROOT/src/lib/domains/dog-training/content/kb-import"
KB_REPO="${DOG_RESEARCH_PATH:-$ROOT/../DogResearch}"

if [[ ! -f "$KB_REPO/package.json" ]]; then
  echo "DogResearch repo not found at $KB_REPO (set DOG_RESEARCH_PATH)" >&2
  exit 1
fi

cd "$KB_REPO"
npm ci
npm run export:good-dog
mkdir -p "$DEST"
cp dist/good-dog-domain.json dist/good-dog-safety.json "$DEST/"
echo "Updated $DEST from $KB_REPO"
