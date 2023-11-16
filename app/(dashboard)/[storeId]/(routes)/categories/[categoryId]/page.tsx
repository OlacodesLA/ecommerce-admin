import getUser from "@/lib/get-user";
import {
  getFirstPublicDocument,
  getStoreDocuments,
} from "@/services/profileServices";
import { redirect } from "next/navigation";
import { CategoryForm } from "./components/category-form";

const CategoryPage = async ({
  params,
}: {
  params: { categoryId: string; storeId: string };
}) => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const category = await getFirstPublicDocument("category", params.categoryId);
  console.log("category", category);

  const billboards = await getStoreDocuments("billboard", params.storeId);
  console.log("Billboards", billboards);
  console.log(params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
      </div>
    </div>
  );
};

export default CategoryPage;
