import getUser from "@/lib/get-user";
import { getFirstPublicDocument } from "@/services/profileServices";
import { redirect } from "next/navigation";
import { ColorForm } from "./components/color-form";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const color = await getFirstPublicDocument("color", params.colorId);
  console.log("color", color);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
