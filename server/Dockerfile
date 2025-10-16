ARG VERSION=lts-alpine

FROM node:$VERSION

ARG NODE_ENV="development"

RUN mkdir /server \
    && mkdir -p /public/images

RUN mkdir -p /var/www/html/images 

WORKDIR /server

COPY package*.json ./

RUN npm install -g nodemon
RUN npm install -g sequelize-cli

RUN npm install

RUN chown -R node:node /server/node_modules

COPY . .

# Копируем скрипт ДО CMD
COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 3000

CMD ["sh", "-c", "/wait-for-it.sh db-dev:5432 -- sequelize db:migrate && sequelize db:seed:all && npm start"]
