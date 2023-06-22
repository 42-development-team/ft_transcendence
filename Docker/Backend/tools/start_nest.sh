#!/bin/sh

if [ ! -d "./nest-app/node_modules" ]; then
    nest new nest-app --package-manager npm

    sed -i 's/3000/4000/g' ./nest-app/src/main.ts
    cd nest-app

    # Setup Prisma ORM
    npm install prisma --save-dev
    npx prisma init

    # Where to put generate?
    # npx prisma generate
fi

npm run start:dev