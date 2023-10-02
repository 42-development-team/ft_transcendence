#!/bin/sh

if [ ! -d "/app/nest_app" ]; then
    nest new nest_app --template=typescript --package-manager npm

    sed -i 's/3000/4000/g' ./nest_app/src/main.ts

    cd /app/nest_app

    # Setup Prisma ORM
    npm install prisma --save-dev
    npx prisma init
fi

cd /app/nest_app

npm install
npm update --save --save-dev

npx prisma migrate dev

# Allow to access and edit database in the browser via port 5555
# (npx prisma studio&)

npm run start:dev