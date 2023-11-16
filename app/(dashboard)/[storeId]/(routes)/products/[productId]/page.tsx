import getUser from "@/lib/get-user";
import {
  getBillboardsByStoreId,
  getFirstPublicDocument,
} from "@/services/profileServices";
import { redirect } from "next/navigation";
import { ProductForm } from "./components/product-form";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  const user = await getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const product = await getFirstPublicDocument("product", params.productId);
  console.log("product", product);

  const categories = await getBillboardsByStoreId("category", params.storeId);
  const sizes = await getBillboardsByStoreId("size", params.storeId);
  const colors = await getBillboardsByStoreId("color", params.storeId);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          colors={colors}
          sizes={sizes}
          initialData={product}
        />
      </div>
    </div>
  );
};

export default ProductPage;
