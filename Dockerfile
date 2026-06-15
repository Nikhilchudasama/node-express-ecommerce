# Stage 1: Build — all deps + Prisma client generation + TypeScript compilation
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install && npm cache clean --force

COPY prisma/ ./prisma/
COPY prisma.config.ts ./
ENV DATABASE_URL=postgresql://dummy:dummy@localhost:5432/dummy
RUN npx prisma generate

COPY tsconfig.json ./
COPY src/ ./src/
RUN npm run build

# Stage 2: Production dependencies only (minus devDeps, plus prisma CLI for migrations)
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev && \
    npm install prisma@^7.8.0 && \
    npm cache clean --force

# Stage 3: Runtime image
FROM node:22-alpine
WORKDIR /app

RUN apk add --no-cache curl && \
    addgroup --system app && \
    adduser --system --ingroup app app

LABEL org.opencontainers.image.title="node-express-basic-demo" \
      org.opencontainers.image.description="Production-ready Node.js REST API for eCommerce" \
      org.opencontainers.image.version="1.0.0"

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:3000/api/v1/health || exit 1

USER app
EXPOSE 3000
CMD ["node", "dist/index.js"]
