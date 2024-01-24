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
    const { label, imageUrl } = body;

    if (!value) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await adminAuth.verifySessionCookie(value, true);

    if (!label) {
      return new NextResponse("Name is Required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image URL is Required", { status: 400 });
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

    const usersCollectionRef = collection(db, "billboard");

    // Use setDoc to create the document
    const newDocRef = doc(usersCollectionRef);
    await setDoc(newDocRef, {
      label,
      imageUrl,
      storeId: params.storeId,
      // store: doc(db, "store", params.storeId),
      userId: user.uid,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Get the ID of the newly created document
    const newDocId = newDocRef.id;

    return NextResponse.json({
      success: true,
      message: "Billboard created successfully",
      storeId: newDocId, // Include the ID in the response
    });
  } catch (error) {
    console.error("[BILLBOARDS_POST]", error);
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

    const billboards = await getBillboardsByStoreId(
      "billboard",
      params.storeId
    );

    return NextResponse.json(billboards);
  } catch (error) {
    console.error("[BILLBOARDS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
