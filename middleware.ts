import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const session = request.cookies.get("session");
  console.log(session);

  // Extract the pathname using the URL object
  const responseAPI = await fetch(`${request.nextUrl.origin}/api/auth`, {
    headers: {
      Cookie: `session=${session?.value}`,
    },
  });

  console.log("RESPONSE_API", responseAPI);

  const url = new URL(request.url);
  const isLoginRoute = url.pathname === "/auth/login";

  // Return to /login if don't have a session and not already on /auth/login
  if (!session && !isLoginRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (responseAPI.status !== 200 && !isLoginRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (responseAPI.status == 200 && isLoginRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
