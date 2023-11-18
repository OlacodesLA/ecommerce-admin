import { cookies, headers } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const authorization = headers().get("Authorization");

    if (authorization?.startsWith("Bearer ")) {
      const idToken = authorization.split("Bearer ")[1];
      const decodedToken = await adminAuth.verifyIdToken(idToken);

      if (decodedToken) {
        const expiresIn = 60 * 60 * 24 * 5 * 1000;
        const sessionCookie = await adminAuth.createSessionCookie(idToken, {
          expiresIn,
        });
        const options = {
          name: "session",
          value: sessionCookie,
          maxAge: expiresIn,
          httpOnly: true,
          secure: true,
        };

        cookies().set(options);
      }
    }

    NextResponse.redirect(new URL("/", req.url));
    NextResponse.redirect(new URL("/", req.url));

    return new NextResponse("User authenticated", {
      status: 200,
      headers: { "content-type": "application/json", Location: "/" },
    });
  } catch (error) {
    console.error("[LOGIN]", error);
    return new NextResponse(`Internal error: ${error} `, { status: 500 });
  }
}
