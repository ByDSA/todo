FROM node:18.17.0-alpine

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm

RUN pnpm install --ignore-scripts

RUN pnpm test:onlyLocal
RUN pnpm build

EXPOSE 8080
CMD [ "pnpm", "start" ]