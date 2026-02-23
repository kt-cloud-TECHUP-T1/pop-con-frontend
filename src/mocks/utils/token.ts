/**
 * Mock JWT 토큰 생성 함수
 * @param type - 토큰 타입 (access, refresh, register)
 * @param userId - 사용자 ID (register 토큰은 null)
 */
export const generateMockToken = (
  type: 'access' | 'refresh' | 'register',
  userId?: number
) => {
  const now = Date.now();

  const header = btoa(
    // 토큰의 알고리즘(HS256)과 타입(JWT) 정보를 담음
    JSON.stringify({
      alg: 'HS256',
      typ: 'JWT',
    })
  );

  const payload = btoa(
    // 실제 데이터가 담기는 부분
    JSON.stringify({
      type, // 토큰의 용도 (액세스, 리프레시, 회원가입용 ...)
      userId: type === 'register' ? null : userId || 105, // register 타입일 때는 null, 그 외에는 입력받은 id나 기본값(105)를 설정
      iat: Math.floor(now / 1000), // 토큰 발행 시간 (Issued At)
      exp: Math.floor(now / 1000) + getExpiration(type), // 토큰 만료 시간 (Expiration)
    })
  );

  // 실제 서버라면 암호화 키가 필요한데, mock 함수이므로 식별 가능한 임의의 문자열을 생성해 합침
  const signature = btoa(`mock-signature-${type}-${now}`);

  return `${header}.${payload}.${signature}`;
};

/**
 * 토큰 타입별 만료 시간 (초 단위)
 * access: 일반적인 APi 요청 인증용
 * refresh: 엑세스 토큰 재발급용
 * register: 회원가입 절차 진행용
 */
const getExpiration = (type: 'access' | 'refresh' | 'register'): number => {
  switch (type) {
    case 'access':
      return 3600; // 1시간
    case 'refresh':
      return 86400 * 7; // 7일
    case 'register':
      return 1800; // 30분
  }
};

/**
 * Mock 토큰 디코딩 (테스트용)
 *
 */
export const decodeMockToken = (token: string) => {
  try {
    const [, payloadBase64] = token.split('.');
    return JSON.parse(atob(payloadBase64));
  } catch {
    return null;
  }
};
