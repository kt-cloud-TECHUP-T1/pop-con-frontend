# 0. 공통 베이스
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat

# 1. 의존성 설치 단계 (Dependencies)
FROM base AS deps
WORKDIR /app

# 의존성 설치 (패키지 매니저 파일 복사)
COPY package.json package-lock.json* ./
RUN npm ci

# 2. 빌드 단계 (Builder)
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 환경변수 주입
ARG NEXT_PUBLIC_PORTONE_STORE_ID
ARG NEXT_PUBLIC_PORTONE_CHANNEL_KEY
ARG NEXT_PUBLIC_API_MOCKING
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_NAVER_CLIENT_ID
ARG NEXT_PUBLIC_QUEUE_SOCKET_URL
ARG NEXT_PUBLIC_QUEUE_SOCKET_PATH
ARG NEXT_PUBLIC_PORTONE_BILLING_CHANNEL_KEY

ENV NEXT_PUBLIC_PORTONE_STORE_ID=$NEXT_PUBLIC_PORTONE_STORE_ID
ENV NEXT_PUBLIC_PORTONE_CHANNEL_KEY=$NEXT_PUBLIC_PORTONE_CHANNEL_KEY
ENV NEXT_PUBLIC_API_MOCKING=$NEXT_PUBLIC_API_MOCKING
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_NAVER_CLIENT_ID=$NEXT_PUBLIC_NAVER_CLIENT_ID
ENV NEXT_PUBLIC_QUEUE_SOCKET_URL=$NEXT_PUBLIC_QUEUE_SOCKET_URL
ENV NEXT_PUBLIC_QUEUE_SOCKET_PATH=$NEXT_PUBLIC_QUEUE_SOCKET_PATH
ENV NEXT_PUBLIC_PORTONE_BILLING_CHANNEL_KEY=$NEXT_PUBLIC_PORTONE_BILLING_CHANNEL_KEY

RUN npm run build

# 3. 실행 단계 (Runner)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# 보안: root가 아닌 별도 사용자로 실행
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Standalone 빌드 결과물에서 필요한 파일만 최소한으로 복사
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Next.js standalone 결과물 실행
CMD ["node", "server.js"]
