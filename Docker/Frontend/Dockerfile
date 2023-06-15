FROM node:18-alpine3.17

WORKDIR /app

RUN npm init -y
RUN npm install -g npm@latest

#[Getting Started | Create React App](https://create-react-app.dev/docs/getting-started/)
RUN npm uninstall -g create-react-app

RUN npx create-react-app transcendence_application --template typescript
EXPOSE 3000

COPY ./tools/start_react.sh .
RUN chmod +x start_react.sh

CMD ["./start_react.sh"]
