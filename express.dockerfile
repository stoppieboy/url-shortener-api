FROM node:20-alpine

EXPOSE 3000
WORKDIR /src

COPY package.json /src
RUN npm install

CMD ["node","--trace-warnings","--watch","index.js"]

COPY . /src
