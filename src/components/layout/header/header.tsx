'use client';

import { GuestHeader } from './guest-header';
import { MemberHeader } from './member-header';

// TODO: 실제 회원 세션 확인 로직이 구현되면 이 임시 플래그를 제거하고 인증 상태 기반으로 헤더 분기
// 현재는 퍼블리싱 작업을 위해 MemberHeader를 기본 노출
const FORCE_MEMBER_HEADER_FOR_PUBLISHING = true;

export function Header() {
  if (FORCE_MEMBER_HEADER_FOR_PUBLISHING) {
    return <MemberHeader />;
  }

  return <GuestHeader />;
}
