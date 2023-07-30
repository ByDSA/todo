FROM node:18.17.0-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm

RUN pnpm install --production
RUN pnpm test
RUN pnpm build

EXPOSE 8080
CMD [ "pnpm", "start" ]