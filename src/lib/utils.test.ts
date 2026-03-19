import { formatWon } from '@/lib/utils';

describe('formatWon', () => {
  it('숫자를 원 단위 문자열로 변환한다', () => {
    expect(formatWon(123456)).toBe('123,456원');
  });

  it('0도 정상적으로 처리한다', () => {
    expect(formatWon(0)).toBe('0원');
  });
});
