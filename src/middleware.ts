import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    return NextResponse.next();
    // const registerToken = request.cookies.get('registerToken')?.value;
    // return registerToken ?
    //     NextResponse.next() :
    //     NextResponse.redirect(new URL('/login', request.url));
    }
    
export const config = {
  matcher: ['/signup', '/verify'],
};
