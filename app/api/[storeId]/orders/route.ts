import { NextResponse, NextRequest } from "next/server";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { adminAuth } from "@/lib/firebase-admin";
import axios from "axios";
import crypto from "crypto";
import {
  getBillboardsByStoreId,
  getFirstDocument,
} from "@/services/profileServices";

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { storeId: string } }
// ) {
//   try {
//     const body = await req.json();

//     if (!params.storeId) {
//       return new NextResponse("Store id is Required", { status: 400 });
//     }

//     const { customer, shipping, totalPrice } = body;
//     const { email, phone, firstName, lastName } = customer;
//     const { address, city, country } = shipping;

//     // Generate a random customer ID
//     const customerId = crypto.randomBytes(8).toString("hex");
//     console.log("body");

//     if (!customer) {
//       return new NextResponse("Customer is Required", { status: 400 });
//     }

//     const response = await axios.post(
//       "https://api.flutterwave.com/v3/payments",
//       {
//         tx_ref: "iro-lagos-" + customerId, // Append customer ID to the tx_ref
//         amount: `${totalPrice * 0.014 + totalPrice}`,
//         // amount: "100",
//         currency: "NGN",
//         redirect_url:
//           process.env.NEXT_PUBLIC_NODE_ENV === "development"
//             ? `${process.env.NEXT_PUBLIC_BASE_URL_STAGGING}/verify`
//             : `${process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION}/verify`,
//         meta: {
//           consumer_id: 23,
//           consumer_mac: "92a3-912ba-1192a",
//           firstName,
//           lastName,
//           phone,
//           email,
//           address,
//           city,
//           country,
//         },
//         customer: {
//           email,
//           phone,
//           firstName,
//           lastName,
//           id: customerId,
//         },
//         customizations: {
//           title: "Iro Lagos",
//           logo:
//             process.env.NEXT_PUBLIC_NODE_ENV === "development"
//               ? `${process.env.NEXT_PUBLIC_BASE_URL_STAGGING}/logo-mini.jpg`
//               : `${process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION}/logo-mini.jpg`,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.NEXT_PUBLIC_FLW_SECRET_KEY}`,
//         },
//       }
//     );

//     const ordersCollectionRef = collection(db, "orders");

//     const newDocRef = doc(ordersCollectionRef);

//     await setDoc(newDocRef, {
//       data: response.data,
//       status: "Intitiated",
//       createdAt: new Date(),
//       updatedAt: new Date(),
//     });

//     console.log(response.data);

//     return NextResponse.json({
//       success: true,
//       status: "Initialted",
//       message: "Payment Initiated",
//       data: response.data, // Include the ID in the response
//     });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ error }));
//   }
// }

export async function POST(
  req: NextRequest,
  { params }: { params: { storeId: string } }
) {
  try {
    const body = await req.json();
    // const { name } = body;

    const { customer, shipping, payment, totalPrice, items } = body;
    const { email, phone, firstName, lastName } = customer;
    const { address, city, country, info } = shipping;

    //     const customerId = crypto.randomBytes(8).toString("hex");
    console.log("body");

    if (!params.storeId) {
      return new NextResponse("Store id is Required", { status: 400 });
    }

    const customerId = crypto.randomBytes(8).toString("hex");
    console.log("body");

    if (!customer) {
      return new NextResponse("Customer is Required", { status: 400 });
    }
    if (!shipping) {
      return new NextResponse("Shipping is Required", { status: 400 });
    }
    if (!totalPrice) {
      return new NextResponse("Total Price is Required", { status: 400 });
    }

    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: "iro-lagos-" + customerId, // Append customer ID to the tx_ref
        amount: `${totalPrice * 0.014 + totalPrice}`,
        // amount: "100",
        currency: "NGN",
        redirect_url:
          process.env.NEXT_PUBLIC_NODE_ENV === "development"
            ? `${process.env.NEXT_PUBLIC_LOCAL_FRONTEND}/verify`
            : `${process.env.NEXT_PUBLIC_PROD_FRONTEND}/verify`,
        meta: {
          consumer_id: 23,
          consumer_mac: "92a3-912ba-1192a",
          firstName,
          lastName,
          phone,
          email,
          address,
          city,
          country,
          items,
        },
        customer: {
          email,
          phone,
          firstName,
          lastName,
          id: customerId,
        },
        customizations: {
          title: "Iro Lagos",
          logo:
            process.env.NEXT_PUBLIC_NODE_ENV === "development"
              ? `${process.env.NEXT_PUBLIC_BASE_URL_STAGGING}/logo-mini.jpg`
              : `${process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION}/logo-mini.jpg`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_FLW_SECRET_KEY}`,
        },
      }
    );

    const ordersCollectionRef = collection(db, "orders");

    const newDocRef = doc(ordersCollectionRef, "iro-lagos-" + customerId);

    await setDoc(newDocRef, {
      // data: response.data,
      items,
      customer,
      shipping,
      totalPrice,
      payment,
      ref: "iro-lagos-" + customerId,
      status: "intitiated",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log(response.data);

    return NextResponse.json({
      success: true,
      message: "Order created successfully",
      link: response.data.data.link, // Include the ID in the response
    });
  } catch (error) {
    console.error("[ORDERS_POST]", error);
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
