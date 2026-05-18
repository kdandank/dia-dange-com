#!/usr/bin/env bash
# Configures the GitHub repo after the first push:
#   - Squash merge only
#   - Branch protection on main: require PR + tests to pass
#   - GitHub Pages enabled from main branch root
#
# Usage: ./setup-github.sh <owner/repo>
# Requires: gh CLI authenticated (gh auth login)

set -euo pipefail

REPO="${1:?Usage: ./setup-github.sh owner/repo}"

echo "Configuring $REPO..."

# Squash-merge only
gh api "repos/$REPO" --method PATCH \
  --field allow_squash_merge=true \
  --field allow_merge_commit=false \
  --field allow_rebase_merge=false \
  --field squash_merge_commit_title=PR_TITLE \
  --field squash_merge_commit_message=PR_BODY \
  --silent
echo "✅  Squash merge only."

# Branch protection on main
gh api "repos/$REPO/branches/main/protection" --method PUT \
  --header "Accept: application/vnd.github+json" \
  --input - <<'JSON'
{
  "required_status_checks": {
    "strict": true,
    "checks": [
      { "context": "Run tests" }
    ]
  },
  "enforce_admins": false,
  "required_pull_request_reviews": {
    "required_approving_review_count": 0,
    "dismiss_stale_reviews": false
  },
  "restrictions": null,
  "required_linear_history": true,
  "allow_force_pushes": false,
  "allow_deletions": false
}
JSON
echo "✅  Branch protection on main: PRs required, tests must pass."

# Enable GitHub Pages from main branch root
gh api "repos/$REPO/pages" --method POST \
  --header "Accept: application/vnd.github+json" \
  --field source='{"branch":"main","path":"/"}' \
  --silent 2>/dev/null \
  || echo "ℹ️   Pages already enabled (or requires manual setup in repo Settings → Pages)."
echo "✅  GitHub Pages configured (main branch, root)."

echo ""
echo "Next: point diadange.com to GitHub Pages."
echo "  In WordPress.com DNS, add these records:"
echo "    A     @   185.199.108.153"
echo "    A     @   185.199.109.153"
echo "    A     @   185.199.110.153"
echo "    A     @   185.199.111.153"
echo "    CNAME www diadange.com"
echo ""
echo "Then in GitHub repo Settings → Pages → Custom domain, enter: diadange.com"
echo "Check 'Enforce HTTPS' once the domain is verified."
