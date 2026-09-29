#!/usr/bin/env bash
# certbot --manual-auth-hook untuk menerbitkan sertifikat wedison.co SEBELUM DNS pindah.
# Selama DNS masih ke Hostinger, validasi HTTP-01 dilakukan Let's Encrypt ke hosting lama,
# jadi file challenge harus ada di public_html Hostinger. Hook ini:
#   1. menulis challenge ke /var/lib/wedison-acme/pending/<token> (diambil operator, lalu
#      di-upload ke Hostinger lewat workflow branch legacy-static, folder ops/acme/),
#   2. juga menaruhnya di webroot lokal (berguna bila DNS sudah pindah),
#   3. menunggu sampai http://<domain>/.well-known/acme-challenge/<token> menyajikannya.
set -euo pipefail

PENDING=/var/lib/wedison-acme/pending
WEBROOT=/var/www/letsencrypt/.well-known/acme-challenge
mkdir -p "$PENDING" "$WEBROOT"
printf '%s' "$CERTBOT_VALIDATION" > "$PENDING/$CERTBOT_TOKEN"
printf '%s' "$CERTBOT_VALIDATION" > "$WEBROOT/$CERTBOT_TOKEN"
chmod 644 "$WEBROOT/$CERTBOT_TOKEN"
echo "menunggu challenge $CERTBOT_DOMAIN token=$CERTBOT_TOKEN" >&2

for _ in $(seq 1 180); do # maks 30 menit
  body=$(curl -fsSL --max-time 10 "http://$CERTBOT_DOMAIN/.well-known/acme-challenge/$CERTBOT_TOKEN" 2>/dev/null || true)
  if [ "$body" = "$CERTBOT_VALIDATION" ]; then
    sleep 5 # beri waktu cache LiteSpeed/CDN Hostinger
    exit 0
  fi
  sleep 10
done
echo "timeout menunggu challenge $CERTBOT_DOMAIN" >&2
exit 1
