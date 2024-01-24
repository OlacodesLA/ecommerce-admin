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

  console.log(products?.data);

  const formattedProducts = await products?.data?.map((item: any) => {
    // Extract sizes, colors, and quantities from items
    const sizes = item?.items?.map((i: any) => i.sizeValue).join(" , ");
    const colors = item?.items?.map((i: any) => i.colorValue);
    const totalQuantity = item?.items.reduce(
      (acc: number, i: any) => acc + i.quantity,
      0
    );

    const date = new Date(
      item?.createdAt?.seconds * 1000 + item?.createdAt?.nanoseconds / 1e6
    );

    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    console.log(formattedDate);

    return {
      id: item?.id,
      name: item?.name,
      isFeatured: item?.isFeatured,
      isArchived: item?.isArchived,
      price: formatter?.format(item?.price),
      category: item?.category.name,
      size: `${sizes}`,
      color: colors,
      quantity: totalQuantity,
      createdAt: formattedDate,
    };
  });

  // coco
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-4">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default BillboardsPage;
