'use client';

import { requestBillingKey } from '../api/payment/request-billing-key';

export default function BillingTestButton() {
  const handleClick = async () => {
    try {
      const billingKey = await requestBillingKey();
      console.log('빌링키 발급 성공:', billingKey);
      alert(`성공: ${billingKey}`);
    } catch (error) {
      console.error('빌링키 발급 실패:', error);

      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('알 수 없는 오류 발생');
      }
    }
  };

  return (
    <button
      onClick={handleClick}
      style={{
        padding: '12px 20px',
        background: 'black',
        color: 'white',
      }}
    >
      빌링키 테스트
    </button>
  );
}
