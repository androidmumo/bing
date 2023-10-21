FROM node:18

WORKDIR /usr/src/app

COPY server/package*.json ./
RUN apt-get update \
    && apt-get install -y iputils-ping \
    && npm install

COPY server .

EXPOSE 8000

CMD [ "node", "index.js" ]