# Fungsi bersama script rilis produksi (di-source, bukan dieksekusi langsung).
# Semua dijalankan sebagai user `wedison` (pemilik PM2), bukan root.

ROOT=${WEDISON_PROD_ROOT:-/home/wedison/wedison-prod}
ECOSYSTEM="$ROOT/ecosystem.prod.config.js"
WEB_PORT=3003
WEB_B_PORT=3013
# = fail_timeout upstream wedison_prod_web di nginx (deploy/nginx/wedison.co.app.conf)
NGINX_FAIL_TIMEOUT=5

log() { printf '[%s] %s\n' "$(date '+%F %T')" "$*"; }
die() { log "ERROR: $*"; exit 1; }

# Tunggu URL membalas 2xx/3xx (maks ~60 detik).
wait_http() {
  local url=$1 i
  for i in $(seq 1 30); do
    curl -fsS -o /dev/null --max-time 5 "$url" && return 0
    sleep 2
  done
  log "tidak sehat: $url"
  return 1
}

# Nama rilis aktif (basename target symlink current), kosong bila belum ada.
current_release() {
  [ -L "$ROOT/current" ] && basename "$(readlink "$ROOT/current")" || true
}

# Pindahkan symlink current secara atomik (rename, bukan hapus+buat).
activate() {
  local sha=$1
  [ -d "$ROOT/releases/$sha" ] || die "rilis $sha tidak ada"
  ln -sfn "releases/$sha" "$ROOT/current.tmp"
  mv -Tf "$ROOT/current.tmp" "$ROOT/current"
  log "current -> releases/$sha"
}

pm2_reload() {
  pm2 startOrReload "$ECOSYSTEM" --only "$1" --update-env >/dev/null
}

# Reload API lalu web utama dan cadangan BERGANTIAN: selama satu restart, nginx
# melayani dari yang lain (upstream backup) -> tanpa downtime.
reload_all() {
  local api_port
  api_port=$(grep -E '^PORT=' "$ROOT/shared/server.env" | cut -d= -f2- || true)
  api_port=${api_port:-4003}

  pm2_reload wedison-prod-api
  wait_http "http://127.0.0.1:$api_port/api/health" || return 1

  pm2_reload wedison-prod-web
  wait_http "http://127.0.0.1:$WEB_PORT/id/" || return 1
  # nginx menandai utama "down" selama fail_timeout sejak gagal konek saat restart; selama
  # itu hanya cadangan yang dipakai -> jangan restart cadangan sebelum jendela itu lewat.
  sleep $((NGINX_FAIL_TIMEOUT + 2))

  pm2_reload wedison-prod-web-b
  wait_http "http://127.0.0.1:$WEB_B_PORT/id/" || return 1

  pm2 save >/dev/null
}

# Segarkan cache ISR kedua instance (halaman di-prerender di CI tanpa API).
revalidate_all() {
  local secret port
  secret=$(grep -E '^REVALIDATE_SECRET=' "$ROOT/shared/server.env" | cut -d= -f2- || true)
  [ -n "$secret" ] || return 0
  for port in $WEB_PORT $WEB_B_PORT; do
    curl -fsS -o /dev/null --max-time 10 -X POST -H "x-revalidate-secret: $secret" \
      "http://127.0.0.1:$port/api/revalidate/" || log "revalidate :$port gagal (tidak fatal)"
  done
}
