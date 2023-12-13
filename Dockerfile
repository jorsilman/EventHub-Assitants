FROM node:13-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json . 

RUN npm install

COPY bin/ ./bin
COPY public ./public
COPY routes/ ./routes
COPY app.js .
COPY models ./models

EXPOSE 3000

CMD npm start