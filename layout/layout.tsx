import React, { ReactNode } from "react";
// import {
//   setFirstName,
//   setLastName,
//   setEmail,
// } from "../store/slice/profileSlice";
// import useAppDispatch from "../hooks/useAppDispatch";
// import { useRouter } from "next/navigation";
// import { getUserById } from "../services/profileServices";
// import { getCookie } from "cookies-next";
// import { IProfilePayload } from "../interfaces/components/profile";
// import { auth } from "@/config/firebase";
import getUser from "@/lib/get-user";

type Props = {
  children: ReactNode;
};

const AppLayout = async () => {
  // const router = useRouter();
  // const dispatch = useAppDispatch();

  const user = await getUser();

  if (user) {
    console.log("user found", user);
  } else {
    console.error("user not found");
  }

  return null;
};

export default AppLayout;
