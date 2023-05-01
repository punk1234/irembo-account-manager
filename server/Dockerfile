# Docker Image for Building services in this directory
# Usage docker build --build-arg TARGET_SERVICE=service-folder
FROM node:17

ENV PORT 80
EXPOSE 80

RUN npm install -g pm2@latest

WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY docker.env ./.env

## Install Dependencies
RUN npm ci

COPY . .
RUN npm run build

CMD ["pm2", "start", "-s", "dist/index.js", "--name", "app", "--no-daemon"]
