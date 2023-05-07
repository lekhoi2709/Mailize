FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

ENV NODE_ENV=production
ENV MONGO_HOST=localhost
ENV DB_PORT=27017
ENV DB_NAME=Mailize

CMD ["npm", "start"]
