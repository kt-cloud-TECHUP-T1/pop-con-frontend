import PortOne from '@portone/browser-sdk/v2';

const STORE_ID = process.env.NEXT_PUBLIC_PORTONE_STORE_ID;
const BILLING_CHANNEL_KEY = process.env.NEXT_PUBLIC_PORTONE_BILLING_CHANNEL_KEY;

export async function requestBillingKey(): Promise<string> {
  if (!STORE_ID) {
    throw new Error('포트원 storeId가 설정되지 않았습니다.');
  }

  if (!BILLING_CHANNEL_KEY) {
    throw new Error('포트원 billing channelKey가 설정되지 않았습니다.');
  }

  const issueResponse = await PortOne.requestIssueBillingKey({
    storeId: STORE_ID,
    channelKey: BILLING_CHANNEL_KEY,
    billingKeyMethod: 'CARD',
  });

  if (!issueResponse) {
    throw new Error('빌링키 발급 응답이 없습니다.');
  }

  if ('code' in issueResponse) {
    throw new Error(issueResponse.message ?? '빌링키 발급 실패');
  }

  return issueResponse.billingKey;
}
