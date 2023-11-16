import { format } from "date-fns";

import { getBillboardsByStoreId } from "@/services/profileServices";
import { ColorsClient } from "./components/client";

const SizesPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await getBillboardsByStoreId("color", params.storeId);

  const formattedColors = colors.map((item: any) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt.toDate(), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
};

export default SizesPage;
