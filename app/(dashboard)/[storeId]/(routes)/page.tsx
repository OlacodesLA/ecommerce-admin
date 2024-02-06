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

  return (
    <div className="flex flex-col justify-center item-center w-full h-full ">
      <h1 className="text-lg font-semibold text-center text-slate-800">
        Active Store : {store?.name}
      </h1>
      <div className="text-center font-bold text-2xl  uppercase">
        Currenly under development 🏗️
      </div>
    </div>
  );
};

export default DashboardPage;
