import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// MOCK: For preview, we'll simulate authentication
// This middleware would normally protect routes that require authentication
export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const publicPaths = ["/", "/auth/signin", "/auth/error"]
  const isPublicPath = publicPaths.includes(path) || path.startsWith("/api/auth")

  // If it's a public path, allow the request
  if (isPublicPath) {
    return NextResponse.next()
  }

  // MOCK: For preview, we'll check for a cookie to simulate authentication
  // In production, this would verify a real JWT token
  const mockAuthCookie = request.cookies.get("mock-auth-cookie")

  // For preview, we'll create a mock token if the cookie doesn't exist
  // This simulates a logged-in user for demonstration purposes
  if (!mockAuthCookie) {
    // In a real app, we would redirect to sign in
    // For preview, we'll just set a mock cookie and continue
    const response = NextResponse.next()
    response.cookies.set("mock-auth-cookie", "authenticated", {
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    return response
  }

  // Allow the request
  return NextResponse.next()
}

// Configure which paths this middleware applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api/webhooks routes (for GitHub webhooks)
     * 2. /_next (Next.js internals)
     * 3. /static (static files)
     * 4. /favicon.ico, /robots.txt (common files)
     */
    "/((?!api/webhooks|_next|static|favicon.ico|robots.txt).*)",
  ],
}
