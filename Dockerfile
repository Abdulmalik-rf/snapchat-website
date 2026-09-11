# syntax=docker/dockerfile:1
# --- 1) التبعيات ---
FROM node:22-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# --- 2) البناء ---
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# متغيرات NEXT_PUBLIC_* تُدمج وقت البناء
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_WHATSAPP_NUMBER
ARG NEXT_PUBLIC_SALLA_STORE_URL
ARG NEXT_PUBLIC_BG_VIDEO
ARG NEXT_PUBLIC_BG_VIDEO_WEBM
ARG NEXT_PUBLIC_BG_POSTER
ARG NEXT_PUBLIC_BG_MODE
ENV NEXT_TELEMETRY_DISABLED=1 STANDALONE=1
RUN pnpm build

# --- 3) التشغيل ---
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
COPY --from=build --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nextjs /app/.next/static ./.next/static
COPY --from=build --chown=nextjs:nextjs /app/public ./public
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
