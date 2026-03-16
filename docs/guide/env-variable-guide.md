# Next.js 환경 변수 추가 가이드 (Docker & CI/CD)

## 먼저 확인하세요: 내 변수가 어느 쪽인가요?

| 구분 | 접두사 예시 | 담당 |
|------|------------|------|
| 브라우저에서 접근하는 변수 | `NEXT_PUBLIC_` | **프론트엔드 개발자** → 아래 가이드 따라 직접 작업 |
| 서버(Node.js/SSR)에서만 사용하는 변수 | 접두사 없음 | **클라우드 네이티브 팀** → 변수명과 용도를 전달하여 k3s 환경 반영 요청 |

> `NEXT_PUBLIC_` 변수는 보안 문제가 없으므로 Docker 빌드 시점에 번들에 포함시킵니다.  
> 그 외 변수는 이미지 레이어에 남지 않도록 런타임(k3s)에서 주입합니다.

---

## 작업 순서 (`NEXT_PUBLIC_` 변수만 해당)

`NEXT_PUBLIC_` 변수가 새로 추가되면 아래 세 곳을 모두 수정해야 합니다.

---

### 1. `Dockerfile` 수정

`ARG`로 외부 값을 받을 수 있도록 선언하고, `ENV`로 빌드 환경에 주입합니다.  
두 줄을 빌드 단계(`Builder`) 안에 추가합니다.

```dockerfile
# 2. 빌드 단계 (Builder)
FROM base AS builder
WORKDIR /app

# 환경변수 주입
ARG NEXT_PUBLIC_PORTONE_STORE_ID
ARG NEXT_PUBLIC_NEW_VARIABLE          # ← 추가

ENV NEXT_PUBLIC_PORTONE_STORE_ID=$NEXT_PUBLIC_PORTONE_STORE_ID
ENV NEXT_PUBLIC_NEW_VARIABLE=$NEXT_PUBLIC_NEW_VARIABLE  # ← 추가

RUN npm run build
```

> Docker 빌드는 로컬과 격리된 환경에서 실행되므로, `ARG`/`ENV` 선언 없이는 `npm run build` 시점에 변수가 비어있어 빌드가 실패하거나 배포 후 기능이 동작하지 않을 수 있습니다.

---

### 2. `.github/workflows/deploy-dev.yml` 수정

Docker 빌드 시 `Dockerfile`의 `ARG`에 실제 값을 전달하는 부분입니다.  
`build-args` 항목에 한 줄 추가합니다.

```yaml
- name: (staging) Build and push image to Amazon ECR
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    build-args: |
      NEXT_PUBLIC_PORTONE_STORE_ID=${{ secrets.NEXT_PUBLIC_PORTONE_STORE_ID }}
      NEXT_PUBLIC_NEW_VARIABLE=${{ secrets.NEXT_PUBLIC_NEW_VARIABLE }}  # ← 추가
```

> 이 설정이 없으면 `Dockerfile`에 `ARG`를 선언했더라도 값이 빈 문자열로 넘어가 변수가 제대로 주입되지 않습니다.

---

### 3. Github Secrets 등록

워크플로우에서 참조하는 `${{ secrets.XXX }}` 값을 Github에 실제로 등록합니다.

1. 프로젝트 Github Repository → **Settings** 탭
2. 좌측 메뉴 **Secrets and variables** → **Actions**
3. **New repository secret** 클릭
4. **Name**: 워크플로우에 작성한 이름 그대로 입력 (예: `NEXT_PUBLIC_NEW_VARIABLE`)
5. **Secret**: 실제 값 입력 후 **Add secret** 저장

> API 키, 인증 정보 등 민감한 값을 소스 코드(`.yml`, `Dockerfile` 등)에 하드코딩하면 안 됩니다. Github Secrets에 등록하면 코드 노출 없이 CI/CD 파이프라인에서 안전하게 값을 주입할 수 있습니다.