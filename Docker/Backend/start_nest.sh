#!/bin/sh

# Create the project if it doesn't exist
if [ ! -d "/app/nest_app" ]; then
    nest new nest_app --package-manager npm

    sed -i 's/3000/4000/g' ./nest_app/src/main.ts

    cd /app/nest_app

    # Setup Prisma ORM
    npm install prisma --save-dev
    npx prisma init
fi

cd /app/nest_app

npm install
npm update --save --save-dev

## Todo: regenerate database without reset
echo "Prisma migrate reset"
npx prisma migrate reset -f

echo "Starting backend"
npm run start:dev