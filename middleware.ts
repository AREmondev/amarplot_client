import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// Supported locales
const locales = ["bn", "en"];
const defaultLocale = "en";

// Get locale from pathname
function getLocale(pathname: string) {
  const segments = pathname.split("/");
  const firstSegment = segments[1];
  return locales.includes(firstSegment) ? firstSegment : null;
}

// Handle locale routing
function handleLocaleRouting(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Only handle explicit English routes (/en)
  if (pathname.startsWith("/en/") || pathname === "/en") {
    return null; // Allow English routes to pass through
  }

  // For all other routes, serve Bengali content without URL prefix
  return null;
}

// Security headers for enhanced protection - COMMENTED OUT FOR DEVELOPMENT
function addSecurityHeaders(response: NextResponse) {
  // Content Security Policy - DISABLED
  // const csp = [
  //   "default-src 'self'",
  //   "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
  //   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  //   "img-src 'self' data: https: blob:",
  //   "font-src 'self' https://fonts.gstatic.com",
  //   "connect-src 'self' http://localhost:4041 http://localhost:3001 http://51.21.132.30:3000/ wss: ws:",
  //   "media-src 'self' https:",
  //   "object-src 'none'",
  //   "base-uri 'self'",
  //   "form-action 'self'",
  //   "frame-ancestors 'none'",
  //   "upgrade-insecure-requests",
  // ].join("; ");

  // ALL SECURITY HEADERS COMMENTED OUT FOR DEVELOPMENT
  // response.headers.set("Content-Security-Policy", csp);
  // response.headers.set("X-Frame-Options", "DENY");
  // response.headers.set("X-Content-Type-Options", "nosniff");
  // response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  // response.headers.set("X-XSS-Protection", "1; mode=block");
  // response.headers.set(
  //   "Strict-Transport-Security",
  //   "max-age=31536000; includeSubDomains; preload"
  // );
  // response.headers.set(
  //   "Permissions-Policy",
  //   "camera=(), microphone=(), geolocation=(), payment=()"
  // );

  // Add CORS headers for development
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );

  return response;
}

export default async function middleware(request: NextRequest) {
  // Handle locale routing first
  const localeResponse = handleLocaleRouting(request);
  if (localeResponse) {
    return addSecurityHeaders(localeResponse);
  }

  // Skip auth for public routes and API routes
  const pathname = request.nextUrl.pathname;
  // const isPublicRoute = pathname.startsWith('/api/') ||
  //                      pathname.includes('/auth') ||
  //                      pathname === '/' ||
  //                      pathname.startsWith('/en/auth')
  const isPublicRoute = true;
  if (isPublicRoute) {
    const response = NextResponse.next();
    return addSecurityHeaders(response);
  }

  // For protected routes, check authentication
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // Redirect to auth without locale prefix (Bengali default)
    const response = NextResponse.redirect(new URL("/auth", request.url));
    return addSecurityHeaders(response);
  }

  // Admin route protection
  if (pathname.includes("/admin") && token.role !== "admin") {
    // Redirect to dashboard without locale prefix (Bengali default)
    const response = NextResponse.redirect(new URL("/dashboard", request.url));
    return addSecurityHeaders(response);
  }

  // Rate limiting for API routes
  if (pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", "100");
    response.headers.set("X-RateLimit-Remaining", "99");
    return addSecurityHeaders(response);
  }

  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

// Middleware for public routes (security headers only)
export function publicMiddleware(request: NextRequest) {
  const response = NextResponse.next();
  return addSecurityHeaders(response);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
