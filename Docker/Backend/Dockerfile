FROM node:20-alpine3.17

WORKDIR /app

RUN npm install -g npm@latest

RUN npm install --save @nestjs/core @nestjs/common @nestjs/passport jest-express cloudinary multer\
    @prisma/client typescript class-transformer class-validator @nestjs/jwt passport-42 @nestjs/websockets @nestjs/platform-socket.io
RUN npm install -g @nestjs/cli

EXPOSE 4000

COPY ./start_nest.sh .
RUN chmod +x start_nest.sh

CMD ["./start_nest.sh"]
