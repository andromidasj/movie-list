FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN apt-get update -y && apt-get install -y openssl

COPY . /app
WORKDIR /app

ENV SKIP_ENV_VALIDATION=true

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm build

FROM base
COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/.next /app/.next

ENV DATABASE_URL=file:/data/db.sqlite

RUN chown -R node:node /app
RUN chmod 755 /app

EXPOSE 3000
CMD [ "pnpm", "start-docker" ]