import getUser from "@/lib/get-user";
import { getFirstDocument } from "@/services/profileServices";
import { redirect } from "next/navigation";
import React from "react";

interface DashboardPageProps {
  params: { storeId: string };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }
  const store = await getFirstDocument("store", user.uid, params.storeId);

  return <div>Active Store {store?.name}</div>;
};

export default DashboardPage;
