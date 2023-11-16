import { format } from "date-fns";
import { ProductClient } from "./components/client";
import { formatter } from "@/lib/utils";
import { getProducts } from "@/axios/endpoints/product.endpoint";
import axios from "axios";
import { getBillboardsByStoreId } from "@/services/profileServices";

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  // const products = await getBillboardsByStoreId("product", params.storeId);
  console.log("STORE_ID", params.storeId);

  const products = await axios.get(
    `${process.env.NEXT_PUBLIC_LOCAL}/api/${params.storeId}/products`
  );

  const formattedProducts = await products?.data?.map((item: any) => ({
    id: item?.id,
    name: item?.name,
    isFeatured: item?.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item?.price),
    category: item?.category.name,
    size: item?.size.name,
    color: item?.color.value,
    // createdAt: format(item?.createdAt?.toDate(), "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default BillboardsPage;
