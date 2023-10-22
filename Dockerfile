FROM node:18

WORKDIR /usr/src/app

COPY server/package*.json ./
RUN npm install

COPY server .

EXPOSE 3000

CMD [ "node", "index.js" ]