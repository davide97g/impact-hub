import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname

  // Check if the path is protected
  const isProtectedPath = path.startsWith("/dashboard") || path.startsWith("/analyze")

  // Check if the user is authenticated
  const isAuthenticated = request.cookies.has("github_session")

  // If the path is protected and the user is not authenticated, redirect to the login page
  if (isProtectedPath && !isAuthenticated) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Continue with the request
  return NextResponse.next()
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/dashboard/:path*", "/analyze/:path*", "/api/github/:path*"],
}
