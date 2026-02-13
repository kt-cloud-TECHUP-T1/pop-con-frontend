# 1. 의존성 설치 단계 (Dependencies)
FROM node:22-alpine AS deps
# Next.js 실행을 위해 필요한 라이브러리 추가 (안정성 보장)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 의존성 설치 (패키지 매니저 파일 복사)
COPY package.json package-lock.json* ./
RUN npm ci

# 2. 빌드 단계 (Builder)
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 3. 실행 단계 (Runner)
FROM node:22-alpine AS runner
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
