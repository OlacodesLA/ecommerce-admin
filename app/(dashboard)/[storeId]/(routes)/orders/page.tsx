import { format } from "date-fns";

import { getBillboardsByStoreId } from "@/services/profileServices";
import { OrderClient } from "./components/client";
import { accessSync } from "fs";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await getBillboardsByStoreId("order", params.storeId);

  const formattedOrders = orders.map((item: any) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem: any) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      item.ordrrItems.reduce((total: any, item: any) => {
        return total + Number(item.product.price);
      })
    ),
    isPaid: item.isPaid,
    createdAt: format(item.createdAt.toDate(), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
