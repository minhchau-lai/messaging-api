FROM node

RUN mkdir -p /app/config /app/src
WORKDIR /app

COPY tsconfig.json /app/tsconfig.json
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
COPY jest.config.js /app/jest.config.js

RUN npm install
CMD ["npm", "run", "build"]