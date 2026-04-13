type GetMyIdResponse =
  | { code: 'SUCCESS'; message: string; data: { userId: string } }
  | { code: string; message: string; data: null };

export async function getMyId(
  accessToken: string
): Promise<string | undefined> {
  try {
    const response = await fetch('/api/users/me/id', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    const result: GetMyIdResponse = await response.json();

    if (result.code === 'SUCCESS' && result.data) {
      return result.data.userId;
    }

    return undefined;
  } catch {
    return undefined;
  }
}
