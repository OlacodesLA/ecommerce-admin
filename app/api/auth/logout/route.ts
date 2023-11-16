import { cookies } from "next/headers";
import { NextResponse } from "next/server";
//Route handler for logout endpoint that expires the session cookie
export async function POST() {
  try {
    const options = {
      name: "session",
      value: "",
      maxAge: -1,
    };

    cookies().set(options);

    return new NextResponse("", {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {}
}
