import { handleProxyResponse } from '@/app/api/shared/route-helpers';

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, '') ??
  'http://localhost:8084';

export async function GET() {
  const url = `${API_BASE}/queues/vqa/start`;
  console.log(
    '11aㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁㅁ'
  );
  console.log(url);
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_agent: '' }),
  });
  console.log(response);

  return handleProxyResponse(response);
}

export async function POST(request: Request) {
  const body = await request.json();

  const response = await fetch(`${API_BASE}/vqa`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  console.log(response);

  return handleProxyResponse(response);
}
