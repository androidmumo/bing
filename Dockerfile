FROM node:18 as builder

WORKDIR /usr/src/app

COPY client/package*.json ./
COPY client/pnpm-lock.yaml ./
RUN npm install pnpm -g && pnpm install

COPY client .
RUN pnpm build

FROM node:18

WORKDIR /usr/src/app

COPY server/package*.json ./
COPY server/pnpm-lock.yaml ./
RUN npm install pnpm -g && pnpm install

COPY server .

COPY --from=builder /usr/src/app/dist /usr/src/app/dist

EXPOSE 3000

CMD [ "node", "index.js" ]