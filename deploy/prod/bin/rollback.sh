#!/usr/bin/env bash
# Kembalikan app produksi ke rilis sebelumnya (atau <sha> tertentu). Tanpa build, ~20 detik.
#   bin/rollback.sh            -> rilis sebelum yang aktif (menurut releases.log)
#   bin/rollback.sh <sha>      -> rilis tertentu (lihat: ls releases/)
#   bin/rollback.sh --list     -> daftar rilis tersedia
# Catatan: skema DB TIDAK ikut mundur. Bila rilis baru membawa migrasi yang merusak,
# restore dump shared/backups/*-pre-<sha>.sql.gz (lihat docs/DEPLOY-PRODUCTION.md).
set -euo pipefail
source "$(dirname "$0")/lib.sh"

CUR=$(current_release)
if [ "${1:-}" = "--list" ]; then
  ls -1t "$ROOT/releases" | while read -r r; do
    printf '%s %s\n' "$([ "$r" = "$CUR" ] && echo '*' || echo ' ')" "$r"
  done
  exit 0
fi

TARGET=${1:-}
if [ -z "$TARGET" ]; then
  # Rilis unik terakhir di log selain yang aktif dan masih ada di disk.
  TARGET=$(awk '{print $2}' "$ROOT/releases.log" | tac | awk '!seen[$0]++' |
    while read -r r; do [ "$r" != "$CUR" ] && [ -d "$ROOT/releases/$r" ] && echo "$r" && break; done)
fi
[ -n "$TARGET" ] || die "tidak ada rilis lain untuk rollback"

log "rollback $CUR -> $TARGET"
activate "$TARGET"
reload_all || die "rilis $TARGET tidak sehat, cek: pm2 logs wedison-prod-web"
revalidate_all
echo "$(date -Is) $TARGET rollback" >> "$ROOT/releases.log"
log "rollback selesai"
