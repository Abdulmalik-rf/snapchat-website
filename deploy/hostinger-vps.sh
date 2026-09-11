#!/usr/bin/env bash
# نشر الموقع على Hostinger VPS عبر Docker + Caddy (HTTPS تلقائي على النطاق المؤقت).
#
# الاستخدام (من جهازك):
#   ssh root@<IP>  ثم شغّل:
#   curl -fsSL https://raw.githubusercontent.com/Abdulmalik-rf/snapchat-website/main/deploy/hostinger-vps.sh | bash -s -- \
#       --repo https://github.com/Abdulmalik-rf/snapchat-website --branch main --domain srv123456.hstgr.cloud
#
# أو انسخ المشروع للسيرفر ثم:  bash deploy/hostinger-vps.sh --domain srv123456.hstgr.cloud --local
set -euo pipefail

REPO=""; BRANCH="main"; DOMAIN=""; LOCAL=0; DIR="/opt/snapchat-website"
while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo) REPO="$2"; shift 2;;
    --branch) BRANCH="$2"; shift 2;;
    --domain) DOMAIN="$2"; shift 2;;
    --dir) DIR="$2"; shift 2;;
    --local) LOCAL=1; shift;;
    *) echo "unknown arg: $1"; exit 1;;
  esac
done
[[ -z "$DOMAIN" ]] && { echo "--domain مطلوب (مثال: srv123456.hstgr.cloud)"; exit 1; }

# 1) Docker
if ! command -v docker >/dev/null 2>&1; then
  echo "▶ تثبيت Docker…"
  curl -fsSL https://get.docker.com | sh
fi
docker compose version >/dev/null 2>&1 || { echo "Docker Compose plugin غير متوفر"; exit 1; }

# 2) الكود
if [[ $LOCAL -eq 1 ]]; then
  DIR="$(pwd)"
else
  [[ -z "$REPO" ]] && { echo "--repo مطلوب"; exit 1; }
  if [[ -d "$DIR/.git" ]]; then
    git -C "$DIR" fetch origin "$BRANCH" && git -C "$DIR" checkout -q "$BRANCH" && git -C "$DIR" reset -q --hard "origin/$BRANCH"
  else
    git clone --depth 1 -b "$BRANCH" "$REPO" "$DIR"
  fi
  cd "$DIR"
fi

# 3) البيئة
if [[ ! -f .env ]]; then
  cp .env.example .env
  sed -i "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://$DOMAIN|" .env
  echo "SITE_DOMAIN=$DOMAIN" >> .env
  echo "⚠ أُنشئ .env من القالب — عدّل المفاتيح (Resend, Salla, Upstash) ثم أعد التشغيل: docker compose up -d --build"
else
  grep -q '^SITE_DOMAIN=' .env && sed -i "s|^SITE_DOMAIN=.*|SITE_DOMAIN=$DOMAIN|" .env || echo "SITE_DOMAIN=$DOMAIN" >> .env
  grep -q '^NEXT_PUBLIC_SITE_URL=' .env && sed -i "s|^NEXT_PUBLIC_SITE_URL=.*|NEXT_PUBLIC_SITE_URL=https://$DOMAIN|" .env || echo "NEXT_PUBLIC_SITE_URL=https://$DOMAIN" >> .env
fi

# 4) الجدار الناري (إن وُجد ufw)
if command -v ufw >/dev/null 2>&1; then ufw allow 80/tcp >/dev/null || true; ufw allow 443/tcp >/dev/null || true; fi

# 5) البناء والتشغيل
set -a; source .env; set +a
docker compose up -d --build
echo "✓ الموقع يعمل على https://$DOMAIN  (قد تستغرق شهادة HTTPS دقيقة عند أول تشغيل)"
docker compose ps
