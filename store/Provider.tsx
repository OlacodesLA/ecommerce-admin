"use client";
import { ReactNode, useEffect } from "react";
import { Provider } from "react-redux";
import store from ".";
import { Toaster } from "react-hot-toast";
import AppLayout from "../layout/layout";
import { ModalProvider } from "@/providers/modalProvider";

type Props = {
  children: ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <Provider store={store}>
      <ModalProvider />
      <Toaster
        position="top-center"
        toastOptions={{
          // Define default options
          className: "text-blue-300",
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />
      {/* <AppLayout>{children}</AppLayout> */}
      {children}
    </Provider>
  );
}
