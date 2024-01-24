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
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const collectionName = "color";
    const documentId = params.colorId;

    const color = await getFirstPublicDocument(collectionName, documentId);

    return NextResponse.json(color, { status: 200 });
  } catch (error) {
    console.error("[COLOR_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
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

    if (!params.colorId) {
      return new NextResponse("color id is required", { status: 400 });
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
    const collectionName = "color"; // Replace with your collection name
    const documentId = params.colorId;
    const updatedData = {
      name,
      value: body.value,
      updatedAt: new Date(),
    };

    const docRef = doc(db, collectionName, documentId);

    const color = await updateDoc(docRef, updatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Color updated successfully",
        store: color,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COLOR_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.colorId) {
      return new NextResponse("Color id is required", { status: 400 });
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

    const collectionName = "color";
    const documentId = params.colorId;

    const docRef = doc(db, collectionName, documentId);

    const color = await deleteDoc(docRef);

    return NextResponse.json(
      {
        success: true,
        message: "Color deleted successfully",
        color: color,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COLOR_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
