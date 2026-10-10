#!/usr/bin/env bash
# Deploy latest origin/main for the good-dog systemd unit.
# Safe to run manually or from CI over SSH.
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/good-dog}"
SERVICE="${SERVICE:-good-dog.service}"
# Prefer system Node so native modules (better-sqlite3) match the service runtime.
export PATH="/usr/bin:/bin:${PATH}"

cd "$APP_DIR"

if [[ -n "$(git status --porcelain)" ]]; then
  echo "Refusing to deploy: working tree is dirty." >&2
  git status --short >&2
  exit 1
fi

current_branch="$(git rev-parse --abbrev-ref HEAD)"
if [[ "$current_branch" != "main" ]]; then
  echo "Checking out main (was on ${current_branch})..."
  git checkout main
fi

echo "Fetching origin/main..."
git fetch --prune origin main
git pull --ff-only origin main

echo "Using $(command -v node) ($(node -v))"
npm ci
npm run build

echo "Restarting ${SERVICE}..."
systemctl restart "$SERVICE"
systemctl is-active --quiet "$SERVICE"

# Brief readiness check against the local Next server.
for _ in 1 2 3 4 5 6 7 8 9 10; do
  if curl -fsS --max-time 2 "http://127.0.0.1:8080/" >/dev/null; then
    echo "Deploy OK: local :8080 responded."
    # Keep the out-of-repo bootstrap copy current for the next CI run.
    if [[ -f "$APP_DIR/scripts/deploy-main.sh" ]]; then
      mkdir -p /opt/good-dog-deploy
      cp "$APP_DIR/scripts/deploy-main.sh" /opt/good-dog-deploy/deploy-main.sh
      chmod +x /opt/good-dog-deploy/deploy-main.sh
    fi
    git log -1 --oneline
    exit 0
  fi
  sleep 1
done

echo "Service is active but local :8080 did not respond in time." >&2
journalctl -u "$SERVICE" -n 40 --no-pager >&2 || true
exit 1
