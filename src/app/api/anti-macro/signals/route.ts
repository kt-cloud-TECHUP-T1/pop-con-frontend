const API_BASE = process.env.ANTI_MACRO_BACKEND_URL?.replace(/\/+$/, '') ?? 'http://localhost:8084';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userAgent = request.headers.get('user-agent') ?? '';
    const forwardedFor = request.headers.get('x-forwarded-for') ?? '';

    // 즉시 200 응답 후 백엔드로 비동기 전달
    fetch(`${API_BASE}/anti-macro/signals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': userAgent,
        'X-Forwarded-For': forwardedFor,
      },
      body: JSON.stringify(body),
    }).catch((e) => {
      console.error('[proxy] 백엔드 전달 실패:', e);
    });

    return Response.json({ received: true });
  } catch (e) {
    console.error('[proxy] signals 에러:', e);
    return Response.json({ received: true }, { status: 200 });
  }
}
