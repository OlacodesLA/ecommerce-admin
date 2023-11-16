import { db } from "@/config/firebase";
import checkAuth from "@/hooks/checkAuth";
import useAuth from "@/hooks/useAuth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import getUser from "@/lib/get-user";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const querySnapshot = await getDocs(
    query(collection(db, "store"), where("userId", "==", user.uid))
  );

  const testing = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log("testing", testing);

  if (querySnapshot && testing[0]?.id) {
    redirect(`/${testing[0].id}`);
  }

  return <>{children}</>;
}
