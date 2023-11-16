"use client";
import {
  Auth,
  GoogleAuthProvider,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { setDoc, doc } from "firebase/firestore";
import {
  IForgotValues,
  ILoginValues,
  IRegistrationValues,
  IResetValues,
} from "@/interfaces/components";
import toast from "react-hot-toast";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { deleteCookie, setCookie } from "cookies-next";
import useMounted from "@/utils";
import { getFirebaseErrorMessage } from "@/utils/errorHandler";
import { usersCollectionRef } from "@/utils/users";
import postToken from "@/lib/post-token";

export const registerUser = async (
  values: IRegistrationValues,
  router: AppRouterInstance,
  setIsLoading: (value: boolean) => void
) => {
  const { email, password, firstName, lastName } = values;
  setIsLoading(true);
  createUserWithEmailAndPassword(auth as Auth, email, password)
    .then(async (cred) => {
      // Attach the user id to the user document
      const userDoc = doc(usersCollectionRef, cred.user.uid);
      // Set the user
      await setDoc(userDoc, {
        email,
        firstName,
        lastName,
      });
      console.log(cred);
    })
    .then(() => {
      toast.success("Account created successfully");
      setIsLoading(false);
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    })
    .catch((error) => {
      console.error(error.message);
      const errorMessage = getFirebaseErrorMessage(error.code);
      toast.error(errorMessage);
      setIsLoading(false);
      return error;
    });
};

export const loginUser = async (
  values: ILoginValues,
  router: AppRouterInstance,
  setIsLoading: (value: boolean) => void
) => {
  const { email, password } = values;
  setIsLoading(true);

  try {
    const cred = (await signInWithEmailAndPassword(
      auth as Auth,
      email,
      password
    )) as any;
    console.log(cred);

    if (cred) {
      await postToken(cred.user);
    }

    if (cred.user) {
      setIsLoading(false);
      toast.success("Successfully Logged In");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } else {
      setIsLoading(false);
    }
  } catch (error: any) {
    console.error(error.message);
    console.log(error.code);
    const errorMessage = getFirebaseErrorMessage(error.code);
    toast.error(errorMessage);
    setIsLoading(false);
  } finally {
    router.push("/");
  }
};

export const logoutUser = async (router: AppRouterInstance) => {
  try {
    await signOut(auth);
    // deleteCookie("auth", { path: "/" });
    const handleLogout = async () => {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.status === 200) {
        router.refresh();
      }
    };

    handleLogout();

    router.refresh();
  } catch (error) {
    console.error(error);

    return error;
  }
};

export const loginWithGoogle = (router: AppRouterInstance) => {
  const provider = new GoogleAuthProvider();

  signInWithPopup(auth as Auth, provider)
    .then((cred) => {
      if (cred) {
        postToken(cred.user);
      }

      // if (cred.user) {
      //   setCookie("auth", "true", {
      //     maxAge: 30 * 24 * 60 * 60,
      //     path: "/",
      //   });
      // }
      // setCookie("userId", cred.user.uid, {
      //   maxAge: 30 * 24 * 60 * 60,
      //   path: "/",
      // });
      toast.success("Successfully Logged In");
      setTimeout(() => {
        router.push("/");
      }, 2000);
      console.log(cred);
    })
    .catch((error) => {
      console.error(error.message);
      const errorMessage = getFirebaseErrorMessage(error.code);
      toast.error(errorMessage);
      return error;
    });
};

export const resetUserPassword = (
  values: IResetValues,
  oobCode: string,
  router: AppRouterInstance,
  setIsLoading: (value: boolean) => void
) => {
  const { newPassword } = values;
  setIsLoading(true);

  confirmPasswordReset(auth as Auth, oobCode, newPassword)
    .then((cred) => {
      console.log(cred);
      toast.success("Password has been changed you can now login");
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error(error.message);
      const errorMessage = getFirebaseErrorMessage(error.code);
      toast.error(errorMessage);
      setIsLoading(false);
    });
};

export const forgotUserPassword = (
  values: IForgotValues,
  router: AppRouterInstance,
  setIsLoading: (value: boolean) => void
) => {
  const { email } = values;
  setIsLoading(true);

  sendPasswordResetEmail(auth as Auth, email, {
    url: "http://localhost:3000/auth/login",
  })
    .then((cred) => {
      console.log(cred);
      toast.success("Email sent, check yout email");
      setIsLoading(false);
    })
    .catch((error) => {
      console.error(error.message);
      const errorMessage = getFirebaseErrorMessage(error.code);
      toast.error(errorMessage);
      setIsLoading(false);
    });
};
