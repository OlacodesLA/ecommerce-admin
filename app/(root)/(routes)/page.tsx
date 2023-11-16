"use client";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";
import { onClose, onOpen } from "@/hooks/use-store-modal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";
import useAppDispatch from "@/hooks/useAppDispatch";
import useAuth from "@/hooks/useAuth";

export default function Home() {
  const dispatch = useAppDispatch();
  const { isOpen } = useSelector((state: RootState) => state.storeModal);
  const { userId } = useAuth();

  useEffect(() => {
    if (!isOpen) {
      dispatch(onOpen());
    }
  }, [isOpen, onOpen]);

  console.log(isOpen);

  console.log(userId);

  return null;
}
