FROM node:20-alpine3.17

WORKDIR /app

RUN npm install -g next@latest

EXPOSE 3000

COPY ./start_next.sh .
RUN chmod +x start_next.sh

CMD ["./start_next.sh"]