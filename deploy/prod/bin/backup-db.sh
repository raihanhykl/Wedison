#!/usr/bin/env bash
# Dump DB produksi ke shared/backups/<waktu>-<label>.sql.gz. Dipakai sebelum migrasi
# (deploy-release.sh) dan harian via cron. Simpan 14 hari.
#   Restore: gunzip -c <file> | psql "<DATABASE_URL tanpa ?schema=...>"
set -euo pipefail
source "$(dirname "$0")/lib.sh"

LABEL=${1:-daily}
DIR="$ROOT/shared/backups"
mkdir -p "$DIR"

URL=$(grep -E '^DATABASE_URL=' "$ROOT/shared/server.env" | cut -d= -f2- | sed -E "s/^['\"]|['\"]$//g")
[ -n "$URL" ] || die "DATABASE_URL tidak ada di shared/server.env"
URL=${URL%%\?*} # libpq menolak parameter Prisma (?schema=public)

OUT="$DIR/$(date +%Y%m%d-%H%M%S)-$LABEL.sql.gz"
pg_dump --no-owner --no-privileges "$URL" | gzip -9 > "$OUT.part"
mv "$OUT.part" "$OUT"
find "$DIR" -name '*.sql.gz' -mtime +14 -delete
log "backup: $OUT ($(du -h "$OUT" | cut -f1))"
