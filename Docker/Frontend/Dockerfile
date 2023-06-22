FROM node:18-alpine3.17

WORKDIR /app

RUN npm init -y
RUN npm install

#[Getting Started | Create React App](https://create-react-app.dev/docs/getting-started/)
RUN npm uninstall -g create-react-app

RUN npx create-react-app transcendence_application --template typescript
EXPOSE 3000

WORKDIR transcendence_application

CMD ["npm", "start"]
