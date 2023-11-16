import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { deleteCookie } from "cookies-next";
import { redirect } from "next/navigation";
import axios from "axios";

//Get the user from the session cookie
//if theres no session or its invalid, return null
export default async function getUser() {
  const session = cookies().get("session")?.value;

  if (!session) {
    return null;
  }

  try {
    const user = await adminAuth.verifySessionCookie(session, true);

    if (!user) {
      axios.post(`${process.env.NEXT_PUBLIC_LOCAL}/api/auth/logout`);
      deleteCookie("session");

      return null;
    }

    return user;
  } catch (error) {
    console.log("USER_SESSION_ERROR", error);
  }
}
