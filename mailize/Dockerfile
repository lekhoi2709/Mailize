FROM node:16-alpine as deps
RUN apk add --no-cache libc6-compat
WORKDIR /app/mailize

COPY package*.json ./
RUN  npm install --production

FROM node:16-alpine AS builder
WORKDIR /app/mailize
COPY --from=deps /app/node_modules ./node_modules
COPY . .
