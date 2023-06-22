FROM node:18-alpine3.17

RUN npm install -g npm@latest
RUN npm install -g next@latest

EXPOSE 3000

COPY ./start_next.sh .

RUN chmod +x start_next.sh
ENTRYPOINT ["./start_next.sh"]