"use client";
import { useState, useEffect } from "react";
import { auth } from "@/config/firebase";

type User = {
  uid: string;
};

export const useAuthListener = () => {};
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      console.log(user);
    });

    return () => unsubscribe();
  }, []);
  const userId = user?.uid || undefined;

  return { user: user, userId };
};

export default useAuth;
