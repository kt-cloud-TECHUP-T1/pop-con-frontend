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
