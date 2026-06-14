# Multi-stage build for the frontend.
# NO NGINX: the production image serves the built static assets with a small
# Node/Express server (server.cjs) listening on 8080.

# --- Build stage --------------------------------------------------------------
FROM node:20-slim AS build
WORKDIR /app

# VITE_API_BASE_URL is baked into the bundle at build time (see CI workflow).
ARG VITE_API_BASE_URL=""
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Runtime stage ------------------------------------------------------------
FROM node:20-slim AS runtime
ENV NODE_ENV=production
ENV PORT=8080
WORKDIR /app

# Install only the dependencies needed to run the static server.
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the built assets and the static server.
COPY --from=build /app/dist ./dist
COPY server.cjs ./server.cjs

EXPOSE 8080
USER node
CMD ["node", "server.cjs"]
