// https://nextjs.org/docs/advanced-features/middleware
import { NextResponse } from 'next/server'
import type { NextRequest , NextMiddleware} from 'next/server'
import { sessionOptions } from './utils/iron-session';
import { getIronSession } from 'iron-session/edge';

const redirect = (url: URL, newPath: string) => {
  if (url.pathname === newPath) return NextResponse.next();
  url.pathname = newPath
  return NextResponse.redirect(url);
}

// This function can be marked `async` if using `await` inside
export const middleware: NextMiddleware = async (req: NextRequest) => {
    // Get current session
    const res = NextResponse.next();
    const session = await getIronSession(req, res, sessionOptions);

    const url = req.nextUrl;

    const isLoggedIn = !!session.user;
    if (!isLoggedIn) {
      return redirect(url, "/auth");
    }
    if (url.pathname.startsWith("/auth") && isLoggedIn) {
      return redirect(url, "/home");
    }
    return NextResponse.next();
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }