FROM node:20-alpine

ENV NODE_ENV development

EXPOSE 3000
WORKDIR /src

COPY package.json /src
RUN npm install

CMD ["npm","run","dev"]

COPY . /src
