#!/usr/bin/env bash
# Pilih apa yang dilayani nginx untuk wedison.co (root). Tidak butuh perubahan DNS.
#   wedison-site app      -> Next.js SSR baru (wedison-prod-web)
#   wedison-site legacy   -> salinan statis situs lama (/var/www/wedison-legacy)
#   wedison-site status   -> tampilkan mode aktif
# Pasang: install -m 755 deploy/prod/root/wedison-site.sh /usr/local/sbin/wedison-site
set -euo pipefail

AVAIL=/etc/nginx/sites-available
LINK=/etc/nginx/sites-enabled/wedison.co
MODE=${1:-status}

if [ "$MODE" = status ]; then
  echo "aktif: $(basename "$(readlink "$LINK" 2>/dev/null || echo 'tidak-ada')")"
  exit 0
fi
case "$MODE" in app|legacy) ;; *) echo "pakai: wedison-site app|legacy|status" >&2; exit 2 ;; esac

TARGET="$AVAIL/wedison.co.$MODE"
[ -f "$TARGET" ] || { echo "tidak ada: $TARGET" >&2; exit 1; }
if [ "$MODE" = legacy ] && [ ! -f /var/www/wedison-legacy/index.html ]; then
  echo "salinan situs lama belum ada di /var/www/wedison-legacy" >&2; exit 1
fi

PREV=$(readlink "$LINK" 2>/dev/null || true)
ln -sfn "$TARGET" "$LINK"
if nginx -t 2>/dev/null; then
  systemctl reload nginx
  echo "wedison.co sekarang: $MODE"
else
  nginx -t || true
  if [ -n "$PREV" ]; then ln -sfn "$PREV" "$LINK"; else rm -f "$LINK"; fi
  echo "konfigurasi nginx tidak valid, dikembalikan" >&2
  exit 1
fi
