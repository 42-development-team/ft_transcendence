#!/bin/sh

# Create the project if it doesn't exist
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
npm update
npm update --save --save-dev

## Todo: regenerate database without reset
echo "Prisma migrate reset"
npx prisma migrate reset -f

#2FA
npm install otplib
npm i --save-dev @types/qrcode

# Allow to access and edit database in the browser via port 5555
#npx prisma generate
#npx prisma migrate dev

(npx prisma studio&)

echo "Starting backend"
npm run start:dev