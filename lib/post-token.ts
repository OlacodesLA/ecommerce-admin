import { clientAuth } from "@/lib/firebase-client";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

//Post client ID token to server
//then sign out of client side auth
//finally refresh the page to get the new session cookie
export default async function postToken(user: any) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  // const router = useRouter();
  const token = await user.getIdToken();
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(res.status);
  if (res.status === 200) {
    //logging out of client side auth is very important as if you didnt you could just log back into the server
    // signOut(clientAuth);
    // location.reload();
  }
}
