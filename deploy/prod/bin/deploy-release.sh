#!/usr/bin/env bash
# Aktifkan rilis produksi yang sudah di-rsync CI ke releases/<sha>/{web,server}.
# Dipanggil GitHub Actions (user wedison):  bin/deploy-release.sh <sha>
# Gagal health check -> otomatis kembali ke rilis sebelumnya dan exit 1.
set -euo pipefail
source "$(dirname "$0")/lib.sh"

SHA=${1:?pakai: deploy-release.sh <sha>}
REL="$ROOT/releases/$SHA"
KEEP=${KEEP_RELEASES:-5}

[ -d "$REL/web" ] && [ -d "$REL/server" ] || die "rilis $REL tidak lengkap"
[ -f "$ROOT/shared/server.env" ] || die "$ROOT/shared/server.env belum ada"

PREV=$(current_release)
log "deploy $SHA (sebelumnya: ${PREV:-tidak ada})"

# 1) Backend: install + build di VPS (sharp/prisma butuh binary Linux).
ln -sfn "$ROOT/shared/server.env" "$REL/server/.env"
cd "$REL/server"
npm ci --no-audit --no-fund --loglevel=error
npm run build

# 2) Backup DB sebelum migrasi (restore manual bila migrasi perlu dibatalkan).
"$ROOT/bin/backup-db.sh" "pre-${SHA:0:7}"
npx prisma migrate deploy

# 3) Switch + reload bergantian. Gagal -> rollback otomatis.
activate "$SHA"
if ! reload_all; then
  if [ -n "$PREV" ] && [ "$PREV" != "$SHA" ]; then
    log "health check gagal -> rollback ke $PREV"
    activate "$PREV"
    reload_all || log "PERINGATAN: rollback juga tidak sehat, cek pm2 logs"
  fi
  die "deploy $SHA gagal"
fi
revalidate_all
echo "$(date -Is) $SHA" >> "$ROOT/releases.log"

# 4) Buang rilis lama (simpan $KEEP terbaru + yang aktif).
cd "$ROOT/releases"
ls -1t | { grep -vx "$SHA" || true; } | tail -n +"$KEEP" | xargs -r rm -rf
log "deploy $SHA selesai"
