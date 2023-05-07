# Build BASE
FROM node:18-alpine as base

# Build Image
FROM base AS builder

WORKDIR /app
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
   elif [ -f package-lock.json ]; then npm ci; \
   elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
   # Allow install without lockfile, so example works even without Node.js installed locally
   else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
   fi
COPY . .

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ARG NEXT_PUBLIC_DATABASE_URL
ENV NEXT_PUBLIC_DATABASE_URL=${NEXT_PUBLIC_DATABASE_URL}

RUN \
   if [ -f yarn.lock ]; then yarn build; \
   elif [ -f package-lock.json ]; then npm run build; \
   elif [ -f pnpm-lock.yaml ]; then pnpm build; \
   else yarn build; \
   fi

# Build production
FROM base AS production

WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

ARG NEXTAUTH_SECRET
ENV NEXTAUTH_SECRET=${NEXTAUTH_SECRET}
ARG NEXTAUTH_URL
ENV NEXTAUTH_URL=${NEXTAUTH_URL}
ARG NEXT_PUBLIC_DATABASE_URL
ENV NEXT_PUBLIC_DATABASE_URL=${NEXT_PUBLIC_DATABASE_URL}

CMD ["npm", "start"]

FROM node:18-alpine

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
   elif [ -f package-lock.json ]; then npm ci; \
   elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
   # Allow install without lockfile, so example works even without Node.js installed locally
   else echo "Warning: Lockfile not found. It is recommended to commit lockfiles to version control." && yarn install; \
   fi

COPY . .
# Next.js collects completely anonymous telemetry data about general usage. Learn more here: https://nextjs.org/telemetry
# Uncomment the following line to disable telemetry at run time
# ENV NEXT_TELEMETRY_DISABLED 1

# Note: Don't expose ports here, Compose will handle that for us

# Start Next.js in development mode based on the preferred package manager
CMD \
   if [ -f yarn.lock ]; then yarn dev; \
   elif [ -f package-lock.json ]; then npm run dev; \
   elif [ -f pnpm-lock.yaml ]; then pnpm dev; \
   else yarn dev; \
   fi