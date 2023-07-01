FROM node:16-alpine AS dependencies

RUN apk add --no-cache git

RUN mkdir -p /usr/app
WORKDIR /usr/app
COPY . /usr/app/

RUN npm install
RUN npm rebuild bcrypt 