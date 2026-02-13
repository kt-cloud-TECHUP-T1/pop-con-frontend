아래는 내 로컬에서 실행한 `git status` 결과야.  
**이 출력에 포함된 정보만을 기준으로** 변경 내역을 분석해서 정리해줘.
(파일 내용은 추측하지 말고, 파일 경로/이름을 기반으로 판단해줘)

---

## 요청 사항

### 1️⃣ 변경 파일 그룹화

- 수정/추가된 파일들을 **의미 있는 단위**로 묶어줘
- 예시 분류:
  - 문서 (docs)
  - 설정 / 컨벤션 (.github 등)
  - 기능 (feature)
  - 리팩토링 (refactor)
  - 기타 (chore)
- **하나의 커밋이 과도하게 커지지 않도록** 적절히 분리해줘

---

### 2️⃣ 각 그룹별 산출물

각 그룹마다 아래 정보를 모두 포함해줘.

- 📁 포함된 파일 목록
- 📝 커밋 메시지
  - 한국어
  - Conventional Commits 형식 사용  
    (예: `feat:`, `fix:`, `docs:`, `chore:`)

출력 형식은 아래를 따라줘:

---

### 3️⃣ 브랜치명 추천

- 각 그룹 또는 전체 변경을 대표하는 **브랜치명**을 추천해줘
- 형식:
  - `feat/기능명`
  - `docs/문서명`
  - `chore/설정-정리`
  - `refactor/대상-내용`

---

### 4️⃣ PR 문서 작성

아래 조건을 반드시 지켜서 PR 문서를 작성해줘.

- **`.github/PULL_REQUEST_TEMPLATE.md` 구조를 그대로 사용**
- 항목 누락 없이 작성
- PR 제목과 본문을 모두 작성

포함할 내용:

- 📝 작업 내용
- 💡 작업 목적
- 🧪 테스트 결과
- 📷 스크린샷 (필요 시)
  💬 리뷰 요구사항 (필요 시)

---

## git status 결과

deleted: .github/ISSUE_TEMPLATE/feature.md
modified: package-lock.json
modified: package.json
modified: src/app/globals.css
modified: src/app/layout.tsx
modified: src/app/sample/avatar/page.tsx
modified: src/app/sample/icon/page.tsx
modified: src/app/sample/shadow/page.tsx
modified: src/app/sample/shape/page.tsx
modified: src/components/Icon/Icon.tsx
modified: src/components/common/CommonAvatar.tsx
modified: src/components/common/CommonAvatarEditable.tsx
modified: src/components/ui/checkbox.tsx
modified: src/constants/design-system.ts

.github/ISSUE_TEMPLATE/bug_report.md
.github/ISSUE_TEMPLATE/feature_request.md
.github/PULL_REQUEST_TEMPLATE.md
.github/refactor.md
docs/
public/mockServiceWorker.js
src/app/providers.tsx
src/app/sample/checkbox/
src/app/test-msw/
src/assets/ui-icons/
src/components/Icon/icons/Checkbox.tsx
src/components/Icon/icons/CheckboxFill.tsx
src/components/Icon/ui-icons/
src/components/common/CommonCheckbox.tsx
src/constants/auth.ts
src/mocks/
