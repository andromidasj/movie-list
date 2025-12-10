# Use official Bun image which includes Node.js
# Bun 1.3.x includes Node.js 22.x
FROM oven/bun:1.3.1 AS base

# Install system dependencies and create non-root user
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends openssl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    groupadd -r bunuser && \
    useradd -r -g bunuser bunuser

WORKDIR /app

# Set environment variables
ENV SKIP_ENV_VALIDATION=true
ENV NODE_ENV=production

# Copy dependency files first for better caching
COPY package.json bun.lockb ./
# Copy prisma directory needed for postinstall script
COPY prisma ./prisma

# Install production dependencies
FROM base AS prod-deps
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
    bun install --frozen-lockfile --production

# Build stage
FROM base AS build
RUN --mount=type=cache,id=bun,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# Copy source files needed for build
COPY . .

# Build the application
RUN bun run build

# Final runtime stage
FROM base AS runtime

# Copy production dependencies
COPY --from=prod-deps --chown=bunuser:bunuser /app/node_modules ./node_modules

# Copy built application
COPY --from=build --chown=bunuser:bunuser /app/.next ./.next
COPY --from=build --chown=bunuser:bunuser /app/public ./public
COPY --from=build --chown=bunuser:bunuser /app/next.config.mjs ./
COPY --from=build --chown=bunuser:bunuser /app/package.json ./
COPY --from=build --chown=bunuser:bunuser /app/prisma ./prisma

# Set database URL
ENV DATABASE_URL=file:/data/db.sqlite

# Use non-root user
USER bunuser

EXPOSE 3000

CMD ["bun", "run", "start-docker"]
