FROM node:latest

WORKDIR /app

COPY package*.json ./
RUN npm install --only=production

COPY . .

EXPOSE 8080

ENV NODE_ENV=production
ENV MONGO_HOST=localhost
ENV DB_PORT=27017
ENV DB_NAME=Mailize

CMD ["npm", "start"]
