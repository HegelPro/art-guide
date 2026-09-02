#!/bin/sh
set -e

# Запускаем privoxy в фоне
privoxy --no-daemon /etc/privoxy/config &

# Ждём, пока privoxy поднимется
sleep 1

# Запускаем основное приложение
exec npm run build:start