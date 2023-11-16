import { NextResponse, NextRequest } from "next/server";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(req: NextRequest) {
  try {
    const { value } = req.cookies.get("session") || {};

    const body = await req.json();
    const { name } = body;

    console.log(name);

    if (!value) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await adminAuth.verifySessionCookie(value, true);

    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }

    const usersCollectionRef = collection(db, "store");

    // Use setDoc to create the document
    const newDocRef = doc(usersCollectionRef);
    await setDoc(newDocRef, {
      name: name,
      userId: user.uid,
    });

    // Get the ID of the newly created document
    const newDocId = newDocRef.id;

    return NextResponse.json({
      success: true,
      message: "Store created successfully",
      storeId: newDocId, // Include the ID in the response
    });
  } catch (error) {
    console.error("[STORES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
