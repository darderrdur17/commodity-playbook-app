#!/usr/bin/env bash
# Run once after creating Neon Postgres — creates tables + demo accounts.
#
# If you get P1001 "Can't reach database server", your network is blocking
# port 5432 (common on school/corporate Wi-Fi). Try:
#   1. Phone hotspot, then re-run this script
#   2. Or use the Vercel setup endpoint (see README / instructions below)

set -euo pipefail

if [ -z "${DATABASE_URL_UNPOOLED:-}" ]; then
  echo "Error: DATABASE_URL_UNPOOLED is not set."
  echo ""
  echo '  DATABASE_URL_UNPOOLED="postgresql://user:pass@host/neondb?sslmode=require" ./scripts/setup-neon-db.sh'
  exit 1
fi

export DATABASE_URL="${DATABASE_URL_UNPOOLED}"

echo "→ Testing connection to Neon..."
if ! nc -z -w 5 "${DATABASE_URL_UNPOOLED#*@}" 5432 2>/dev/null; then
  HOST=$(echo "$DATABASE_URL_UNPOOLED" | sed -n 's|.*@\([^/]*\)/.*|\1|p' | cut -d: -f1)
  if ! nc -z -w 5 "$HOST" 5432 2>/dev/null; then
    echo ""
    echo "⚠ Cannot reach $HOST:5432 — your network likely blocks Postgres."
    echo ""
    echo "Option A: Connect via phone hotspot and run this script again."
    echo "Option B: Run setup on Vercel (after deploying latest code):"
    echo '  curl -X POST https://commodity-playbook-app.vercel.app/api/setup-db \'
    echo '    -H "Authorization: Bearer YOUR_SETUP_SECRET"'
    echo ""
    exit 1
  fi
fi

echo "→ Pushing schema to Neon..."
npx prisma db push

echo "→ Seeding demo accounts..."
npm run db:seed

echo ""
echo "Done! Demo login: elite.insider@demo.com / Demo1234!"
echo "Test at: https://commodity-playbook-app.vercel.app/demo"
