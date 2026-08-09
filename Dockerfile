# syntax=docker/dockerfile:1

# ---- deps: install once, cached across builds unless lockfile changes ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- builder: compile with dev deps available, then prune via standalone output ----
FROM node:22-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# DATABASE_URL etc. aren't needed at build time — no page in this app does
# build-time data fetching against them — but Next still evaluates
# process.env references, so provide harmless placeholders rather than
# leaving them undefined during the build.
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# ---- runner: minimal final image, only the standalone server + static assets ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
