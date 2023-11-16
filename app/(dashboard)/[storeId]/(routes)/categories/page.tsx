import { format } from "date-fns";

import { getBillboardsByStoreId } from "@/services/profileServices";
import { CategoryClient } from "./components/client";
import { accessSync } from "fs";
import { CategoryColumn } from "./components/columns";

const CategoriesPage = async ({ params }: { params: { storeId: string } }) => {
  const categories = await getBillboardsByStoreId("category", params.storeId);

  const formattedCategories = categories.map((item: any) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    createdAt: format(item.createdAt.toDate(), "MMMM do, yyyy"),
  }));

  console.log("formatted", formattedCategories);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
