# CommonModal 컴포넌트 사용 가이드

- 공통 모달 컴포넌트는 shadcn/ui의 Dialog를 기반으로 제작되었으며, 아이콘 표시 여부와 사이즈, 라운드 처리를 유동적으로 조절할 수 있습니다.

## 📦 디렉토리 구조

```
src/
  app/
    sample/
      modal/
        page.tsx        # 모달 컴포넌트 샘플 페이지
  components/
    common/
      CommonModal.tsx   # 모달 컴포넌트
  constants/
    design-system.ts    # 스타일 상수
```

## 🎨 모달 사용법

### 일반적인 메시지 모달 (아이콘 포함)

```typescript
import CommonModal, { ModalBody, ModalFooter } from '@/components/common/CommonModal';
import { Button } from '@/components/ui/button';

<CommonModal
  isOpen={isOpen}
  onClose={handleClose}
  icon="CheckCircle" // 아이콘 이름
  title="인증 완료"
  showClose={true}
>
  <ModalBody>
    성공적으로 인증되었습니다.<br />
    이제 모든 서비스를 이용하실 수 있습니다.
  </ModalBody>
  <ModalFooter>
    <Button onClick={handleClose}>확인</Button>
  </ModalFooter>
</CommonModal>
```

### 아이콘 없는 심플 모달

```typescript
<CommonModal
  isOpen={isOpen}
  onClose={handleClose}
  title="공지사항"
  showClose={false}
>
  <ModalBody>
    점검 중에는 서비스 이용이 제한됩니다.
  </ModalBody>
</CommonModal>
```

### Props

#### CommonModal

- `isOpen`: 모달의 표시 여부
- `onClose`: 모달이 닫힐 때 실행되는 함수
- `title`: 모달 상단에 표시될 제목
- `icon`: 제목 위에 표시될 아이콘 이름
- `iconSize`: 아이콘의 크기
- `size`: 모달의 가로 너비 (sm:384px, md:480px, lg:512px)
- `radius`: 모달의 테두리 곡률 (디자인 시스템 기준)
- `showClose`: 우측 상단 X 버튼 표시 여부

#### ModalBody & ModalFooter

- `ModalBody`: 모달의 본문 텍스트 스타일(색상, 간격)을 일관되게 적용합니다.
- `ModalFooter`: 하단 버튼 영역을 정렬합니다.
