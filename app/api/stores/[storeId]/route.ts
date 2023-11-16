import getUser from "@/lib/get-user";
import { NextResponse } from "next/server";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
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

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    // Update Firestore document
    const collectionName = "store"; // Replace with your collection name
    const documentId = params.storeId;
    const updatedData = {
      name,
    };

    const docRef = doc(db, collectionName, documentId);

    const store = await updateDoc(docRef, updatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Store updated successfully",
        store: store,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[STORE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const collectionName = "store";
    const documentId = params.storeId;

    const docRef = doc(db, collectionName, documentId);

    const store = await deleteDoc(docRef);

    return NextResponse.json(
      {
        success: true,
        message: "Store deleted successfully",
        store: store,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[STORE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
