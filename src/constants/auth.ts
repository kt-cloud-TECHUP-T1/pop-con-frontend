export const AUTH_MESSAGES = {
  IDENTITY: {
    SUCCESS: {
      NEW_USER: '본인인증이 완료되었습니다. 약관에 동의해주세요.',
      EXISTING_USER: '계정 연결 및 로그인이 완료되었습니다.',
    },
    ERROR: {
      INVALID_INPUT: '입력값이 올바르지 않습니다.',
      UNDERAGE: '만 14세 미만은 가입이 제한됩니다.',
      INVALID_AUTH: '인증 정보가 유효하지 않습니다.',
      REQUIRED_ID: '본인인증 식별자가 필요합니다.',
      REQUIRED_REGISTER_TOKEN: '가입 진행 토큰이 필요합니다.',
      MISSING_CONFIG: 'Portone 환경변수가 설정되지 않았습니다.',
      VERIFY_FAILED: '본인인증에 실패했습니다.',
      MODULE_ERROR: '인증 모듈 오류가 발생했습니다. 다시 시도해주세요.',
    },
  },
  SIGNUP: {
    ERROR: {
      DUPLICATE_NICKNAME: '이미 사용 중인 닉네임입니다.',
      DUPLICATE_EMAIL: '이미 가입된 이메일입니다.',
    },
  },
  TERMS: {
    SUCCESS: {
      JOIN_COMPLETED: '약관 동의 및 회원가입이 완료되었습니다.',
    },
    ERROR: {
      REQUIRED_NOT_AGREED: '필수 동의 항목입니다.',
      ALREADY_REGISTERED: '이미 약관 동의 및 회원가입이 완료된 회원입니다.',
      SESSION_EXPIRED:
        '회원가입 세션이 만료되었습니다. 다시 가입 절차를 진행해주세요.',
    },
  },
  TOKEN: {
    SUCCESS: {
      REFRESHED: '토큰이 재발급되었습니다.',
    },
    ERROR: {
      REFRESH_TOKEN_REQUIRED: 'refreshToken이 필요합니다.',
      EXPIRED: '인증이 만료되었습니다. 다시 로그인해주세요.',
      SERVER_ERROR_ON_SAVE: '저장 중 오류가 발생했습니다. 다시 시도해주세요.',
    },
  },
} as const;

export const AUTH_ERROR_CODES = {
  // 가입 플로우 (J)
  JOIN: {
    UNDERAGE: 'J001', // 만 14세 미만 가입 제한
    ALREADY_COMPLETED: 'J002', // 이미 약관 동의/회원가입 완료
  },

  // 비즈니스 공통 규칙 (C)
  COMMON: {
    ALREADY_REGISTERED: 'C002', // 이미 가입된 회원 (비즈니스 제약)
    DUPLICATE_NICKNAME: 'C003', // 닉네임 중복
  },

  // 계정 상태 및 정보 (U)
  USER: {
    DUPLICATE_EMAIL: 'U001', // 이미 가입된 이메일
    MISSING_SOCIAL_INFO: 'U002', // 가입 세션 소셜 정보 누락
  },

  // 인증 및 세션 (A)
  AUTH: {
    SESSION_EXPIRED: 'A001', // 가입 세션 만료
    INVALID_AUTH: 'A002', // 인증 정보 유효하지 않음
    LOGIN_REQUIRED: 'A003', // 재로그인 필요
  },

  // 포트원 연동 (I, E)
  PORTONE: {
    FETCH_FAILED: 'I001', // 포트원 본인인증 정보 조회 실패
    VERIFY_FAILED: 'I002', // 본인인증 검증 실패
    ENCRYPT_FAILED: 'E001', // 데이터 암호화 실패
  },
} as const;

export const AUTH_RESPONSE_CODE = {
  NEXT_STEP: {
    TERMS: 'TERMS',
    HOME: 'HOME',
  },
} as const;

export const TERMS: readonly {
  id: string;
  label: string;
  isRequired: boolean;
  apiKey: string;
}[] = [
  {
    id: 'privacy',
    label: '개인정보 수집 및 이용 동의',
    isRequired: true,
    apiKey: 'isPrivacyPolicyAgreed',
  },
  {
    id: 'identifierPolicy',
    label: '고유식별정보 처리 동의',
    isRequired: true,
    apiKey: 'isIdentifierPolicyAgreed',
  },
  {
    id: 'servicePolicy',
    label: 'Pop-con 서비스 이용약관 동의',
    isRequired: true,
    apiKey: 'isServicePolicyAgreed',
  },
  {
    id: 'marketing',
    label: '마케팅 수신 동의',
    isRequired: false,
    apiKey: 'isMarketingAgreed',
  },
];
