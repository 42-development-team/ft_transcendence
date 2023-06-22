#!/bin/sh

nest new nest-app --package-manager npm

sed -i 's/3000/4000/g' ./nest-app/src/main.ts
cd nest-app

# Setup Prisma ORM
npm install prisma --save-dev
npx prisma init

npm run start:dev