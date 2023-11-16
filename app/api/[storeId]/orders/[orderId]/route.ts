import getUser from "@/lib/get-user";
import { NextResponse } from "next/server";
import { deleteDoc, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import {
  getFirstDocument,
  getFirstPublicDocument,
} from "@/services/profileServices";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const collectionName = "billboard";
    const documentId = params.billboardId;

    const billboard = await getFirstPublicDocument(collectionName, documentId);

    return NextResponse.json(billboard, { status: 200 });
  } catch (error) {
    console.error("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const user = await getUser();

    const body = await req.json();
    const { label, imageUrl } = body;

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!label) {
      return new NextResponse("Label is Required", { status: 400 });
    }

    if (!label) {
      return new NextResponse("Image URL is Required", { status: 400 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard id is required", { status: 400 });
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
    const collectionName = "billboard"; // Replace with your collection name
    const documentId = params.billboardId;
    const updatedData = {
      label,
      imageUrl,
      updatedAt: serverTimestamp(),
    };

    const docRef = doc(db, collectionName, documentId);

    const billboard = await updateDoc(docRef, updatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Billboard updated successfully",
        store: billboard,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
    }

    const collectionName = "billboard";
    const documentId = params.billboardId;

    const docRef = doc(db, collectionName, documentId);

    const billboard = await deleteDoc(docRef);

    return NextResponse.json(
      {
        success: true,
        message: "billboard deleted successfully",
        billboard: billboard,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
