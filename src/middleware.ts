import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/profile"],
};

// import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";

// export async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname;

//   // Public routes that don't require authentication
//   const publicRoutes = [
//     "/sign-in",
//     "/sign-up",
//     "/verify-email",
//     "/forgot-password",
//     "/reset-password"
//   ];

//   // Auth routes that should redirect to homepage if already authenticated
//   const authRoutes = ["/sign-in", "/sign-up", "/forgot-password"];

//   // Check if user is authenticated
//   const sessionCookie = getSessionCookie(request);
//   const isAuthenticated = !!sessionCookie;

//   // Redirect authenticated users away from auth pages
//   if (isAuthenticated && authRoutes.some(route => path.startsWith(route))) {
//     return NextResponse.redirect(new URL("/", request.url));
//   }

//   // Protect routes that require authentication
//   if (!isAuthenticated &&
//       !publicRoutes.some(route => path.startsWith(route)) &&
//       !path.startsWith("/api/auth")) {

//     const signInUrl = new URL("/sign-in", request.url);
//     signInUrl.searchParams.set("callbackUrl", encodeURI(request.url));
//     return NextResponse.redirect(signInUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/((?!_next/static|_next/image|favicon.ico|.*\\.svg).*)",
//   ],
// };
