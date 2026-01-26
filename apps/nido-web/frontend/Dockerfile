FROM node:22-slim

WORKDIR /app

COPY package.json .
# Copy lock file if it exists, otherwise it will be generated
COPY package-lock.json* ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
