import getUser from "@/lib/get-user";
import { NextResponse } from "next/server";
import {
  arrayUnion,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import {
  getFirstDocument,
  getFirstPublicDocument,
} from "@/services/profileServices";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }

    const productCollectionName = "product";
    const colorCollectionName = "color";
    const categoryCollectionName = "category";
    const sizeCollectionName = "size";

    const documentId = params.productId;

    // Get the product document
    const product = await getFirstPublicDocument(
      productCollectionName,
      documentId
    );

    if (!product) {
      return new NextResponse("Product not found", { status: 404 });
    }

    // Fetch additional data for colors
    // const colorDoc = await getDoc(doc(db, colorCollectionName, product.color));
    // const color = colorDoc.exists() ? colorDoc.data() : null;

    // Fetch additional data for categoryId
    // const categoryDoc = await getDoc(
    //   doc(db, categoryCollectionName, product.categoryId)
    // );
    // const category = categoryDoc.exists() ? categoryDoc.data() : null;

    // Fetch additional data for sizes
    // const sizeDoc = await getDoc(doc(db, sizeCollectionName, product.sizes));
    // const size = sizeDoc.exists() ? sizeDoc.data() : null;

    // Combine the product data with additional data
    const responseData = {
      ...product,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const user = await getUser();

    const body = await req.json();
    const {
      name,
      price,
      // quantity,
      description,
      categoryId,
      colorId,
      sizeId,
      images,
      items,
      isFeatured,
      isArchived,
    } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }

    if (!price) {
      return new NextResponse("Price is Required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category Id is Required", { status: 400 });
    }
    if (!colorId || !colorId.length) {
      return new NextResponse("Color Id is Required", { status: 400 });
    }
    // if (!quantity) {
    //   return new NextResponse("Quantity is Required", { status: 400 });
    // }
    if (!description) {
      return new NextResponse("Description is Required", { status: 400 });
    }
    if (!sizeId || !sizeId.length) {
      return new NextResponse("Size Id Required", { status: 400 });
    }
    if (!items || !items.length) {
      return new NextResponse("Size Id Required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Image are required", { status: 400 });
    }

    if (!params.productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const storeUserById = await getFirstDocument(
      "store",
      user.uid,
      params.storeId
    );

    if (!storeUserById) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    // Update Firestore document
    const collectionName = "product"; // Replace with your collection name
    const documentId = params.productId;
    const updatedData = {
      name,
      price,
      categoryId,
      colorId,
      sizeId,
      items,
      isFeatured,
      isArchived,
      images: arrayUnion(...images),
      updatedAt: new Date(),
    };

    const docRef = doc(db, collectionName, documentId);

    const product = await updateDoc(docRef, updatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Product updated successfully",
        store: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.productId) {
      return new NextResponse("Product Id is required", { status: 400 });
    }

    const collectionName = "product";
    const documentId = params.productId;

    const docRef = doc(db, collectionName, documentId);

    const product = await deleteDoc(docRef);

    return NextResponse.json(
      {
        success: true,
        message: "product deleted successfully",
        product: product,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
