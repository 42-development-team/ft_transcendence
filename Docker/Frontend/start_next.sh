#!/bin/sh

mkdir -p app
cd app

if [ ! -d "/app/transcendence_application" ]; then
    export CI=true
    npx create-next-app transcendence_application --ts --src-dir
fi

cd transcendence_application
npm install

## Development
npm run dev

## Production
#npm run build && npm run start