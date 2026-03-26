const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ?? 'http://localhost:8084';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const res = await fetch(`${API_BASE}/anti-macro/signals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('user-agent') ?? '',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') ?? '',
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return Response.json(data);
  } catch (e) {
    console.error('[proxy] signals 에러:', e);
    return Response.json({ received: true }, { status: 200 });
  }
}
