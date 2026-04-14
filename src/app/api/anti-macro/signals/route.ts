const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ?? 'http://localhost:8084';

export async function POST(request: Request) {
  try {
    // 원본 바디/헤더 pass-through (Content-Encoding: gzip 포함)
    const body = await request.arrayBuffer();
    const headers: Record<string, string> = {
      'Content-Type': request.headers.get('content-type') ?? 'application/json',
      'User-Agent': request.headers.get('user-agent') ?? '',
      'X-Forwarded-For': request.headers.get('x-forwarded-for') ?? '',
    };
    const contentEncoding = request.headers.get('content-encoding');
    if (contentEncoding) headers['Content-Encoding'] = contentEncoding;

    // 즉시 200 응답 후 백엔드로 비동기 전달
    fetch(`${API_BASE}/anti-macro/signals`, {
      method: 'POST',
      headers,
      body,
    }).catch((e) => {
      console.error('[proxy] 백엔드 전달 실패:', e);
    });

    return Response.json({ received: true });
  } catch (e) {
    console.error('[proxy] signals 에러:', e);
    return Response.json({ received: true }, { status: 200 });
  }
}
