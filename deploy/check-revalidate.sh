#!/usr/bin/env bash
# Verifikasi webhook revalidate backend -> frontend (dijalankan DI VPS lewat ssh dari GitHub Actions):
#   ssh wedison@VPS bash -s -- <env-file> <port-web>[,<port-web>...] < deploy/check-revalidate.sh
#
# Backend memanggil POST {REVALIDATE_URL|FRONTEND_URL}/api/revalidate/ setiap admin menyimpan konten
# (artikel, harga, Opening Teasers, ...). Bila URL/secret salah, perubahan baru tampil setelah ISR
# kedaluwarsa dan halaman baru tidak masuk sitemap. Skrip ini:
#   1. menampilkan target yang dipakai backend (hanya URL, secret tidak pernah dicetak),
#   2. memastikan setiap instance web lokal (port) tercakup,
#   3. memanggil setiap target dengan secret dari env backend dan mewajibkan HTTP 200.
# Exit 1 bila ada yang salah.
set -uo pipefail

ENV_FILE=${1:?env file}
PORTS=${2:?port web, mis. 3002 atau 3003,3013}
fail=0

val() { grep -E "^$1=" "$ENV_FILE" | tail -n1 | cut -d= -f2- | sed -e 's/^["'\'']//' -e 's/["'\'']$//'; }

[ -f "$ENV_FILE" ] || { echo "::error::$ENV_FILE tidak ditemukan"; exit 1; }
REVALIDATE_URL=$(val REVALIDATE_URL || true)
FRONTEND_URL=$(val FRONTEND_URL || true)
SECRET=$(val REVALIDATE_SECRET || true)
TARGETS=${REVALIDATE_URL:-$FRONTEND_URL}

echo "env           : $ENV_FILE"
echo "REVALIDATE_URL: ${REVALIDATE_URL:-<kosong>}"
echo "FRONTEND_URL  : ${FRONTEND_URL:-<kosong>}"
echo "dipakai       : ${TARGETS:-<kosong>}"
echo "secret        : $([ -n "$SECRET" ] && echo "terisi (${#SECRET} karakter)" || echo KOSONG)"

if [ -z "$SECRET" ]; then echo "::error::REVALIDATE_SECRET kosong di $ENV_FILE: webhook revalidate dimatikan"; fail=1; fi
if [ -z "$TARGETS" ]; then echo "::error::REVALIDATE_URL dan FRONTEND_URL kosong di $ENV_FILE"; fail=1; fi

for port in ${PORTS//,/ }; do
  if ! grep -qE "(127\.0\.0\.1|localhost):$port(/|,|$)" <<<"$TARGETS"; then
    echo "::error::Instance web :$port tidak ada di target revalidate ($ENV_FILE). Seharusnya: REVALIDATE_URL=$(printf 'http://127.0.0.1:%s,' ${PORTS//,/ } | sed 's/,$//')"
    fail=1
  fi
done

IFS=',' read -ra LIST <<<"$TARGETS"
for t in "${LIST[@]}"; do
  t=$(echo "$t" | xargs | sed 's:/*$::')
  [ -n "$t" ] || continue
  code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 -X POST \
    -H 'content-type: application/json' -H "x-revalidate-secret: $SECRET" \
    -d '{"tags":["teasers"]}' "$t/api/revalidate/" || echo 000)
  if [ "$code" = "200" ]; then echo "OK    $t/api/revalidate/ -> 200"
  else echo "::error::$t/api/revalidate/ -> HTTP $code (401 = secret beda dengan frontend, 000 = tidak terjangkau)"; fail=1; fi
done

[ "$fail" = 0 ] && echo "Webhook revalidate OK" || echo "Webhook revalidate BERMASALAH"
exit "$fail"
