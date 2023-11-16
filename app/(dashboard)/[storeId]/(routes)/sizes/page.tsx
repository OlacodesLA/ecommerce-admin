import { format } from "date-fns";

import { getBillboardsByStoreId } from "@/services/profileServices";
import { SizesClient } from "./components/client";
import { accessSync } from "fs";
import { SizeColumn } from "./components/columns";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await getBillboardsByStoreId("size", params.storeId);

  const formattedSizes = sizes.map((item: any) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt.toDate(), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <SizesClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default SizesPage;
