import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // 이미 회원가입한 유저면 홈으로 보내야 함
  if (refreshToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  const registerToken = request.cookies.get('register_token')?.value;
  if (!registerToken) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/signup', '/verify'],
};
