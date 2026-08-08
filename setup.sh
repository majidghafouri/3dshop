#!/usr/bin/env bash
set -euo pipefail

# =============================================================================
#  Figurize 3D Shop — zero-to-running setup script
#  Run this on a fresh machine after cloning the repo:
#      git clone https://github.com/majidghafouri/3dshop.git && cd 3dshop
#      ./setup.sh
# =============================================================================

# -- config ---------------------------------------------------------------
DB_NAME="${DB_NAME:-figurize}"
DB_URL_BASE="${DATABASE_URL_BASE:-postgresql://localhost:5432}"
DEV_PORT="${DEV_PORT:-3000}"
YELLOW='\033[1;33m'; GREEN='\033[1;32m'; RED='\033[1;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✔${NC} $1"; }
warn() { echo -e "${YELLOW}⚠${NC} $1"; }
die()  { echo -e "${RED}✖${NC} $1"; exit 1; }

echo "==> Figurize setup (figurize 3D shop)"

# -- 1. prerequisites ------------------------------------------------------
command -v node >/dev/null 2>&1 || die "Node.js is required (>= 18). Install from https://nodejs.org"
command -v npm  >/dev/null 2>&1 || die "npm is required"
command -v psql >/dev/null 2>&1 || die "PostgreSQL client (psql) is required. Install via https://www.postgresql.org/download/"
ok "prerequisites found (node $(node -v), npm $(npm -v))"

# -- 2. environment file ----------------------------------------------------
if [ ! -f .env ]; then
  JWT=$(node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))")
  cat > .env <<EOF
DATABASE_URL="${DB_URL_BASE}/${DB_NAME}?schema=public"
JWT_SECRET="${JWT}"
JWT_EXPIRES_IN="7d"
APP_URL="http://localhost:${DEV_PORT}"
ADMIN_PHONE="09120000000"
EOF
  ok ".env created (JWT_SECRET auto-generated, admin phone 09120000000)"
else
  warn ".env already exists — keeping it"
fi

# -- 3. database ------------------------------------------------------------
if ! pg_isready -q 2>/dev/null; then
  warn "PostgreSQL is not running — start it, e.g.:  brew services start postgresql@16  (macOS)"
fi

if psql -lqt 2>/dev/null | cut -d '|' -f1 | grep -qw "$DB_NAME"; then
  ok "database '$DB_NAME' already exists"
else
  createdb "$DB_NAME" 2>/dev/null && ok "database '$DB_NAME' created" \
    || die "could not create database '$DB_NAME'. Is PostgreSQL running?"
fi

# -- 4. dependencies --------------------------------------------------------
if [ -d node_modules ]; then
  ok "node_modules already present"
else
  warn "installing dependencies (this can take a while)..."
  npm install
  ok "dependencies installed"
fi

# -- 5. schema + seed -------------------------------------------------------
npx prisma migrate deploy
ok "migrations applied"
node prisma/seed.js
ok "database seeded (24 products, 4 categories, admin 09120000000)"

# -- 6. done ----------------------------------------------------------------
echo
echo "====================================================="
echo "  Setup complete! Start the dev server with:"
echo "      npm run dev"
echo "  Then open:  ${GREEN}http://localhost:${DEV_PORT}${NC}"
echo "  API docs:   ${GREEN}http://localhost:${DEV_PORT}/docs${NC}"
echo "====================================================="
