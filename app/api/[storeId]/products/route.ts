import { NextResponse, NextRequest } from "next/server";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { adminAuth } from "@/lib/firebase-admin";
import {
  enhanceProductData,
  getBillboardsByStoreId,
  getDocumentData,
  getFirstDocument,
  getProductsByParams,
} from "@/services/profileServices";

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { value } = req.cookies.get("session") || {};

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

    if (!value) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await adminAuth.verifySessionCookie(value, true);

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

    if (!params.storeId) {
      return new NextResponse("Store id is Required", { status: 400 });
    }

    const storeUserById = await getFirstDocument(
      "store",
      user.uid,
      params.storeId
    );

    if (!storeUserById) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    const usersCollectionRef = collection(db, "product");

    // Use setDoc to create the document
    const newDocRef = doc(usersCollectionRef);
    await setDoc(newDocRef, {
      name,
      price,
      isFeatured,
      isArchived,
      colorId,
      categoryId,
      sizeId,
      storeId: params.storeId,
      items,
      // store: doc(db, "store", params.storeId),
      // quantity,
      description,
      images,
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Get the ID of the newly created document
    const newDocId = newDocRef.id;

    return NextResponse.json({
      success: true,
      message: "Products created successfully",
      storeId: newDocId, // Include the ID in the response
    });
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);

    const criteria = {
      categoryId: searchParams.get("categoryId") || undefined,
      colorId: searchParams.getAll("colorId") || undefined,
      sizeId: searchParams.getAll("sizeId") || undefined,
      isFeatured: searchParams.get("isFeatured") === "true" || undefined,
    };

    if (!params.storeId) {
      return new NextResponse("Store id is Required", { status: 400 });
    }

    const products = await getProductsByParams(params.storeId, criteria);
    console.log(products);

    return NextResponse.json(products);
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
