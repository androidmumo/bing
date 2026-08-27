FROM node:24-alpine AS builder

# 版本号(Release tag)注入前端构建,显示在页脚
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION

WORKDIR /usr/src/app

COPY client/package*.json ./
COPY client/pnpm-lock.yaml ./
RUN npm install pnpm@8 -g && pnpm install

COPY client ./
RUN pnpm build

FROM node:24-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache --update tzdata
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime && echo 'Asia/Shanghai' > /etc/timezone
COPY server/package.json ./
COPY server/pnpm-lock.yaml ./
RUN npm install pnpm@8 -g && pnpm install -P

COPY server .

COPY --from=builder /usr/src/app/dist /usr/src/app/dist

EXPOSE 3000

CMD [ "node", "index.js" ]
