#!/usr/bin/env bash
# Dijalankan cron tiap 15 menit (root) SAMPAI DNS wedison.co pindah ke VPS.
# Sertifikat awal diterbitkan lewat Hostinger (authenticator manual) -> tidak bisa renew
# otomatis. Begitu domain terbukti sudah dilayani VPS ini, terbitkan ulang dengan webroot
# lokal (renew otomatis oleh certbot.timer), lalu cron ini menghapus dirinya sendiri.
set -euo pipefail

CRON=/etc/cron.d/wedison-cert-cutover
WEBROOT=/var/www/letsencrypt
PROBE=wedison-probe-$(hostname)
mkdir -p "$WEBROOT/.well-known/acme-challenge"
echo "$PROBE" > "$WEBROOT/.well-known/acme-challenge/$PROBE"
chmod 644 "$WEBROOT/.well-known/acme-challenge/$PROBE"

# Kedua nama (IPv4 & IPv6 apa pun yang dipakai resolver publik) harus sampai ke VPS ini.
for d in wedison.co www.wedison.co; do
  for ipflag in -4 -6; do
    # Lewati jalur IPv6 bila domain memang tidak punya AAAA.
    if [ "$ipflag" = -6 ] && [ -z "$(dig +short AAAA "$d" @1.1.1.1 | grep ':' || true)" ]; then continue; fi
    got=$(curl "$ipflag" -fsS --max-time 10 "http://$d/.well-known/acme-challenge/$PROBE" 2>/dev/null || true)
    [ "$got" = "$PROBE" ] || exit 0 # belum pindah (atau belum merata) -> coba lagi nanti
  done
done

logger -t wedison-cert "DNS wedison.co sudah ke VPS, menerbitkan ulang sertifikat via webroot"
certbot certonly --webroot -w "$WEBROOT" --cert-name wedison.co \
  -d wedison.co -d www.wedison.co --force-renewal --non-interactive \
  --deploy-hook "systemctl reload nginx"
rm -f "$WEBROOT/.well-known/acme-challenge/$PROBE" "$CRON"
logger -t wedison-cert "sertifikat wedison.co kini renew otomatis (webroot); cron dihapus"
