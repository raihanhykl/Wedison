#!/usr/bin/env bash
# certbot --manual-cleanup-hook pasangan acme-hostinger-auth.sh.
rm -f "/var/lib/wedison-acme/pending/$CERTBOT_TOKEN" \
  "/var/www/letsencrypt/.well-known/acme-challenge/$CERTBOT_TOKEN"
