import { NextResponse, NextRequest } from "next/server";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { adminAuth } from "@/lib/firebase-admin";
import axios from "axios";
import crypto from "crypto";
import {
  getBillboardsByStoreId,
  getFirstDocument,
} from "@/services/profileServices";
import { sendEmail } from "@/emails/config";
import NikeReceiptEmail from "@/emails/confirmation";
import { render } from "@react-email/render";
import { sendVerificationEmail } from "@/emails/sender";

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    // const { name } = body;

    const { ref, transaction_id } = body;

    console.log("body");

    if (!params.storeId) {
      return new NextResponse("Store id is Required", { status: 400 });
    }

    if (!transaction_id) {
      return new NextResponse("Transaction id is Required", { status: 400 });
    }

    // const ordersCollectionRef = collection(db, "orders");

    // const newDocRef = doc(ordersCollectionRef, ref);

    // const order = await getDoc(newDocRef);

    const response = await axios.get(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FLW_SECRET_KEY}`,
        },
      }
    );
    const responseData = {
      data: response.data, // Extract the response data
      status: response.status, // Extract the HTTP status code
    };

    const ordersCollectionRef = collection(db, "orders");
    const newDocRef = doc(ordersCollectionRef, ref);

    await updateDoc(newDocRef, {
      status: response.data.status,
      payment_type: response.data.data.payment_type,
      charged_amount: response.data.data.charged_amount,
      updatedAt: new Date(),
    });

    const order = await getDoc(doc(db, "orders", "iro-lagos-9ee47c5e28f11df8"));
    console.log("ORDER_DATA", order.data());
    await sendVerificationEmail(order.data());

    console.log(responseData);

    return NextResponse.json({
      success: true,
      message: "Verified successfully",
      serverResponse: responseData, // Include the ID in the response
    });
  } catch (error) {
    console.error("[VERIFY_POST]", error);
    return new NextResponse(`Internal error ${error}`, { status: 500 });
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
