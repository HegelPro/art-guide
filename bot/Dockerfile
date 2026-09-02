FROM node:lts

# Установка privoxy
RUN apt-get update && apt-get install -y privoxy && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./

RUN npm install
ADD . ./

# entrypoint, который поднимает privoxy И запускает приложение
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]