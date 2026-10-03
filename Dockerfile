# ---- Build stage: dependencies yahan install hongi ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

# ---- Runtime stage: clean image, npm ke baghair ----
FROM node:20-alpine

# OpenSSL fix (libcrypto3/libssl3) + npm hatao (tar, glob, minimatch etc. ke CVEs khatam)
RUN apk upgrade --no-cache \
 && rm -rf /usr/local/lib/node_modules/npm \
           /usr/local/bin/npm \
           /usr/local/bin/npx \
           /opt/yarn-*

WORKDIR /app

COPY --from=build /app /app

USER node

EXPOSE 5000

CMD ["node", "server.js"]