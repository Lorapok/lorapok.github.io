# agent/Dockerfile
# Production container specification for LoLaBo Microservice Engine

FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
RUN npm install

# Copy source and build
COPY . .
RUN npx tsc || true

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080
ENV HOST=0.0.0.0

# Install production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled JavaScript from builder
COPY --from=builder /app/*.js ./
COPY --from=builder /app/package.json ./

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:8080/health || exit 1

CMD ["node", "server.js", "--daemon"]
