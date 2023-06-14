FROM node:18

WORKDIR /app

RUN npm init -y 
RUN npm install

RUN npx create-react-app frontend --template typescript

EXPOSE 3000

CMD ["npm", "start"]
