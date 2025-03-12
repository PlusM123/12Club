import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authMiddleware } from './middleware/auth'

// export function middleware(request: NextRequest) {
//   // Add a new header x-current-path which passes the path to downstream components
//   const headers = new Headers(request.headers)
//   headers.set('x-current-path', request.nextUrl.pathname)
//   return NextResponse.next({ headers })
// }

// export const config = {
//   matcher: [
//     // match all routes except static files and APIs
//     '/((?!api|_next/static|_next/image|favicon.ico).*)'
//   ]
// }
export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/comment/:path*', '/edit/:path*']
}

export const middleware = async (request: NextRequest) => {
  return authMiddleware(request)
}
