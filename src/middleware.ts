import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // const registerToken = request.cookies.get('register_token')?.value;

  // if (!registerToken) {
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ['/signup', '/verify'],
};
