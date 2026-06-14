# syntax=docker/dockerfile:1

# 1) Install all dependencies (including dev) for the build.
FROM node:20-slim AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# 2) Compile TypeScript to dist/.
FROM node:20-slim AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY package*.json tsconfig.json ./
COPY src ./src
RUN npm run build

# 3) Install production-only dependencies.
FROM node:20-slim AS prod-deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# 4) Minimal runtime image running as a non-root user on port 8080.
FROM node:20-slim AS runtime
ENV NODE_ENV=production \
    PORT=8080 \
    FUNCTION_TARGET=api \
    GOOGLE_CLOUD_PROJECT=demo-starter
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
EXPOSE 8080
CMD ["node_modules/.bin/functions-framework", "--target=api", "--source=dist", "--port=8080"]
