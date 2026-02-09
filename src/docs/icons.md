# Icon 컴포넌트 사용 가이드

## 📦 디렉토리 구조

```
src/
  assets/
    icons/              # 원본 SVG 파일 (피그마에서 내보낸 파일)
      LogoNaver.svg
      ChevronUp.svg
      ...
  components/
    Icon/
      icons/            # 변환된 React 컴포넌트
        LogoNaver.tsx
        ChevronUp.tsx
        index.ts
      Icon.tsx          # 공통 Icon 래퍼 컴포넌트
```

## 🎨 아이콘 사용법

### 기본 사용

```typescript
import { Icon } from '@/components/Icon/Icon';

<Icon name="LogoNaver" />
<Icon name="ChevronUp" size={32} />
<Icon name="ChevronLeft" color="#FF0000" />
<Icon name="ChevronRight" className="text-blue-500" />
```

### Props

- `name`: 아이콘 이름 (필수, 자동완성 지원)
- `size`: 아이콘 크기 (기본값: 24)
- `color`: 아이콘 색상 (기본값: 'currentColor')
- `className`: 추가 스타일 클래스
- `onClick`: 클릭 이벤트 핸들러

## ➕ 새 아이콘 추가하기

### 1. Figma에서 SVG 내보내기

- 아이콘 선택 → Export → SVG
- **파일명 규칙**: PascalCase, 언더스코어/하이픈/공백 제거
  - ✅ `LogoNaver.svg`
  - ✅ `ChevronUpSmall.svg`
  - ❌ `Logo_Naver.svg`
  - ❌ `chevron-up.svg`
  - ❌ `Chevron Up.svg`

### 2. 파일 저장

`src/assets/icons/` 폴더에 SVG 파일 저장

### 3. 변환 명령어 실행 (순서대로)

```bash
# (1) SVG 최적화
svgo -f src/assets/icons

# (2) React 컴포넌트로 변환
npx @svgr/cli --out-dir src/components/Icon/icons --typescript --icon -- src/assets/icons

# (3) index.ts 자동 생성
node scripts/generate-icon-exports.js
```

### 4. 완료!

이제 `<Icon name="새로운아이콘" />`으로 사용 가능 (타입 자동완성 지원)

## 🔧 scripts/generate-icon-exports.js

프로젝트 루트에 `scripts/generate-icon-exports.js` 파일이 필요합니다:

```javascript
const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '../src/components/Icon/icons');
const files = fs
  .readdirSync(iconsDir)
  .filter((file) => file.endsWith('.tsx') && file !== 'index.ts');

const exports = files
  .map((file) => {
    const name = file.replace('.tsx', '');
    return `export { default as ${name} } from './${name}';`;
  })
  .join('\n');

fs.writeFileSync(path.join(iconsDir, 'index.ts'), exports + '\n');

console.log(`✅ Generated exports for ${files.length} icons`);
```

## ⚠️ 주의사항

1. **색상 관리**: Figma에서 아이콘 색상을 검정(#000000)으로 통일하면 `color` prop으로 색상 변경 가능
2. **크기 통일**: 모든 아이콘은 24x24px 기준으로 제작 (viewBox 기반 스케일링)
3. **파일명 중복**: 같은 이름의 아이콘이 있으면 덮어씌워지니 주의
4. **Git 관리**: `src/assets/icons/`는 원본 보관용, `src/components/Icon/icons/`는 생성 파일

## 🚀 한 줄 명령어 (선택사항)

package.json에 스크립트 추가:

```json
{
  "scripts": {
    "icons:build": "svgo -f src/assets/icons && npx @svgr/cli --out-dir src/components/Icon/icons --typescript --icon -- src/assets/icons && node scripts/generate-icon-exports.js"
  }
}
```

이제 `npm run icons:build` 한 번으로 모든 과정 실행!

## 📚 참고

- [SVGR 공식 문서](https://react-svgr.com/)
- [SVGO 공식 문서](https://github.com/svg/svgo)
