import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // TODO: 백엔드 register_token 발급/검증 API 완료 후 아래 로직 활성화 필요 (`#27`)
  // const registerToken = request.cookies.get('register_token')?.value;

  // if (!registerToken) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/signup', '/verify'],
};
