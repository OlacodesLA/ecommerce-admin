import { NextResponse, NextRequest } from "next/server";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { adminAuth } from "@/lib/firebase-admin";
import {
  getBillboardsByStoreId,
  getFirstDocument,
} from "@/services/profileServices";

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const { value } = req.cookies.get("session") || {};

    const body = await req.json();
    const { name } = body;

    if (!value) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await adminAuth.verifySessionCookie(value, true);

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }
    if (!body.value) {
      return new NextResponse("Value is Required", { status: 400 });
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

    const usersCollectionRef = collection(db, "color");

    // Use setDoc to create the document
    const newDocRef = doc(usersCollectionRef);
    await setDoc(newDocRef, {
      name,
      value: body.value,
      storeId: params.storeId,
      // store: doc(db, "store", params.storeId),
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Get the ID of the newly created document
    const newDocId = newDocRef.id;

    return NextResponse.json(
      {
        success: true,
        message: "Color created successfully",
        storeId: newDocId, // Include the ID in the response
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[COLOR_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is Required", { status: 400 });
    }

    const colors = await getBillboardsByStoreId("color", params.storeId);

    return NextResponse.json(colors, { status: 200 });
  } catch (error) {
    console.error("[COLORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
