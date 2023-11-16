import { format } from "date-fns";

import { getBillboardsByStoreId } from "@/services/profileServices";
import { BillboardClient } from "./components/client";
import { accessSync } from "fs";
import { BillBoardColumn } from "./components/columns";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await getBillboardsByStoreId("billboard", params.storeId);

  const formattedBillboards = billboards.map((item: any) => ({
    id: item.id,
    label: item.label,
    createdAt: format(item.createdAt.toDate(), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
