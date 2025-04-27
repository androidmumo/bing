FROM node:18 as builder

WORKDIR /usr/src/app

COPY client/package*.json ./
COPY client/pnpm-lock.yaml ./
RUN npm install pnpm@8 -g && pnpm install

COPY client .
RUN pnpm build

FROM alpine:latest

WORKDIR /usr/src/app

RUN apk add --no-cache --update nodejs npm tzdata
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
COPY server/package*.json ./
COPY server/pnpm-lock.yaml ./
RUN npm install pnpm@8 -g && pnpm install -P

COPY server .

COPY --from=builder /usr/src/app/dist /usr/src/app/dist

EXPOSE 3000

CMD [ "node", "index.js" ]