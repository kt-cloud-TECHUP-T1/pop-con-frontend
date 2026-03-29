//엑세스 토큰을 통해 등록된 간편 결제 리스트 조회
const getBillingList = async (accessToken: string) => {
  const res = await fetch('/api/billing/my', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.code);
  }

  return result.data;
};
