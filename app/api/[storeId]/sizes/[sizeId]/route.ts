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
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const collectionName = "size";
    const documentId = params.sizeId;

    const size = await getFirstPublicDocument(collectionName, documentId);

    return NextResponse.json(size, { status: 200 });
  } catch (error) {
    console.error("[SIZE_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const user = await getUser();

    const body = await req.json();
    const { name } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }

    if (!body.value) {
      return new NextResponse("Value is Required", { status: 400 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
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
    const collectionName = "size"; // Replace with your collection name
    const documentId = params.sizeId;
    const updatedData = {
      name,
      value: body.value,
      updatedAt: new Date(),
    };

    const docRef = doc(db, collectionName, documentId);

    const size = await updateDoc(docRef, updatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Size updated successfully",
        store: size,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SIZE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
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

    const collectionName = "size";
    const documentId = params.sizeId;

    const docRef = doc(db, collectionName, documentId);

    const size = await deleteDoc(docRef);

    return NextResponse.json(
      {
        success: true,
        message: "size deleted successfully",
        size: size,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[SIZE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
