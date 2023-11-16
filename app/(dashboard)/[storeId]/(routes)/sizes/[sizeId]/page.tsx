import getUser from "@/lib/get-user";
import { getFirstPublicDocument } from "@/services/profileServices";
import { redirect } from "next/navigation";
import { SizeForm } from "./components/size-form";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const size = await getFirstPublicDocument("size", params.sizeId);
  console.log("size", size);
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
