#!/usr/bin/env bash
# Установка / обновление портфолио на Ubuntu/Debian. Запуск из папки репозитория: PORT=8081 bash deploy/install.sh
set -euo pipefail
SRC="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${PORT:-8081}"
command -v node >/dev/null || { apt-get update -y && apt-get install -y curl ca-certificates && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs; }
cat > /etc/systemd/system/portfolio.service <<UNIT
[Unit]
Description=Portfolio site
After=network.target
[Service]
WorkingDirectory=$SRC
Environment=PORT=$PORT
ExecStart=/usr/bin/node serve.js
Restart=always
DynamicUser=yes
[Install]
WantedBy=multi-user.target
UNIT
systemctl daemon-reload && systemctl enable portfolio >/dev/null && systemctl restart portfolio
command -v ufw >/dev/null && ufw status | grep -q active && ufw allow "$PORT/tcp" || true
sleep 1; echo ">> Портфолио: http://$(hostname -I | awk '{print $1}'):$PORT/"
