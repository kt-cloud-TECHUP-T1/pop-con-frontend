const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ??
  'http://localhost:8084';

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization') ?? '';

  if (!authorization) {
    return Response.json(
      { code: 'A002', message: '유효하지 않은 토큰입니다.', data: null },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(`${API_BASE}/users/me/id`, {
      method: 'GET',
      headers: {
        Authorization: authorization,
      },
      cache: 'no-store',
    });

    const result = await response.json();
    return Response.json(result, { status: response.status });
  } catch (e) {
    console.error('[proxy] /users/me/id 에러:', e);
    return Response.json(
      { code: 'S001', message: '시스템 오류가 발생했습니다.', data: null },
      { status: 500 }
    );
  }
}
