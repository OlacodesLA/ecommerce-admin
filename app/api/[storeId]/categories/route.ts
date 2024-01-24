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
    const { name, billboardId } = body;

    if (!value) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await adminAuth.verifySessionCookie(value, true);

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard Id is Required", { status: 400 });
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

    const billboard = await getFirstDocument(
      "billboard",
      user.uid,
      billboardId
    );

    if (!billboard) {
      return new NextResponse("Invalid Billboard", { status: 400 });
    }

    const usersCollectionRef = collection(db, "category");

    // Use setDoc to create the document
    const newDocRef = doc(usersCollectionRef);
    await setDoc(newDocRef, {
      name,
      billboardId,
      storeId: params.storeId,
      // store: doc(db, "store", params.storeId),
      billboard,
      userId: user.uid,
      createdAt: new Date(),

      updatedAt: new Date(),
    });

    console.log(new Date());

    // Get the ID of the newly created document
    const newDocId = newDocRef.id;

    return NextResponse.json({
      success: true,
      message: "Category created successfully",
      storeId: newDocId, // Include the ID in the response
    });
  } catch (error) {
    console.error("[CATEGORY_POST]", error);
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

    const categories = await getBillboardsByStoreId("category", params.storeId);

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
