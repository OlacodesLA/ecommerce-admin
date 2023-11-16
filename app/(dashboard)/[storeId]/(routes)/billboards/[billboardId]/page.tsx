import getUser from "@/lib/get-user";
import { getFirstPublicDocument } from "@/services/profileServices";
import { redirect } from "next/navigation";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const billboard = await getFirstPublicDocument(
    "billboard",
    params.billboardId
  );
  console.log("billboard", billboard);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
