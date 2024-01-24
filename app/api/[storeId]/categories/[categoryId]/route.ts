import getUser from "@/lib/get-user";
import { NextResponse } from "next/server";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import {
  getFirstDocument,
  getFirstPublicDocument,
} from "@/services/profileServices";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const collectionName = "category";
    const documentId = params.categoryId;

    const category = await getFirstPublicDocument(collectionName, documentId);

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const user = await getUser();

    const body = await req.json();
    const { name, billboardId } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }

    if (!billboardId) {
      return new NextResponse("Billboad Id is Required", { status: 400 });
    }

    if (!params.categoryId) {
      return new NextResponse("Catagory id is required", { status: 400 });
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
    const collectionName = "category"; // Replace with your collection name
    const documentId = params.categoryId;
    const updatedData = {
      name,
      billboardId,
      updatedAt: new Date(),
    };

    const docRef = doc(db, collectionName, documentId);

    const category = await updateDoc(docRef, updatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Category updated successfully",
        store: category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.categoryId) {
      return new NextResponse("Store id is required", { status: 400 });
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

    const collectionName = "category";
    const documentId = params.categoryId;

    const docRef = doc(db, collectionName, documentId);

    const category = await deleteDoc(docRef);

    return NextResponse.json(
      {
        success: true,
        message: "Category deleted successfully",
        category: category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
