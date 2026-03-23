import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // TODO: 테스트 완료 후 주석 해제
  // const registerToken = request.cookies.get('register_token')?.value;
  // if (!registerToken) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
  // return NextResponse.next();
}

export const config = {
  matcher: ['/signup, /verify'],
};
