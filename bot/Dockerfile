FROM node:lts

# Установка privoxy
RUN apt-get update && apt-get install -y privoxy && rm -rf /var/lib/apt/lists/*

# Конфиг privoxy — слушать на localhost внутри контейнера
RUN echo "listen-address 127.0.0.1:8118" >> /etc/privoxy/config

WORKDIR /app

COPY package*.json ./

RUN npm install
ADD . ./

# entrypoint, который поднимает privoxy И запускает приложение
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]