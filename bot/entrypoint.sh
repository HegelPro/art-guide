#!/bin/sh
set -e

# Запускаем privoxy в фоне
privoxy --no-daemon /etc/privoxy/config &

# Конфиг privoxy — слушать на localhost внутри контейнера
# echo "listen-address ${PROXY_URL}" >> /etc/privoxy/config
echo "forward-socks5 / ${SOCK5_PROXY} ." >> /etc/privoxy/config

# Ждём, пока privoxy поднимется
sleep 1

# Запускаем основное приложение
exec npm run build:start