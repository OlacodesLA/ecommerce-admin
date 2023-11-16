import React from "react";
import { redirect } from "next/navigation";
import { getFirstDocument } from "@/services/profileServices";
import getUser from "@/lib/get-user";
import Navbar from "@/components/navbar";

const DashboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const data = await getFirstDocument("store", user.uid, params.storeId);
  console.log(data);

  if (!data) {
    redirect(`/`);
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

export default DashboardLayout;
