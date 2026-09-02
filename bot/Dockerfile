FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm install
ADD . ./

CMD [ "npm", "run", "build:start" ]