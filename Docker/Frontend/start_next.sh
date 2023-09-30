#!/bin/sh

# Create the project if it doesn't exist
if [ ! -d "/app/next_app" ]; then
    export CI=true
    npx create-next-app next_app --template=typescript --ts --src-dir

    cd /app/next_app
    npx next telemetry disable

fi

cd /app/next_app

npm install
npm update --save --save-dev

## Development
npm run dev