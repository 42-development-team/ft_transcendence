FROM node:20-alpine3.17

WORKDIR /app

RUN npm install --save @nestjs/core @nestjs/common typescript
RUN npm install -g @nestjs/cli

EXPOSE 4000

COPY ./start_nest.sh .
RUN chmod +x start_nest.sh

CMD ["./start_nest.sh"]
