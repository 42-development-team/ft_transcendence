FROM node:18-alpine3.17

WORKDIR /app

RUN npm init -y
RUN npm install

RUN npm install --save @nestjs/core @nestjs/common typescript
RUN npm i -g @nestjs/cli

EXPOSE 4000

COPY ./tools/start_nest.sh .
RUN chmod +x start_nest.sh

CMD ["./start_nest.sh"]
