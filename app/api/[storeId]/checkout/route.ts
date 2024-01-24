import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import crypto from "crypto";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  const { customerData, shippingData, totalPrice } = body;
  const { email, phone, firstName, lastName } = customerData;
  const { address, city, country } = shippingData;

  // Generate a random customer ID
  const customerId = crypto.randomBytes(8).toString("hex");

  try {
    const response = await axios.post(
      "https://api.flutterwave.com/v3/payments",
      {
        tx_ref: "iro-lagos-" + customerId, // Append customer ID to the tx_ref
        amount: `${totalPrice * 0.014 + totalPrice}`,
        // amount: "100",
        currency: "NGN",
        redirect_url:
          process.env.NEXT_PUBLIC_NODE_ENV === "development"
            ? `${process.env.NEXT_PUBLIC_BASE_URL_STAGGING}/verify`
            : `${process.env.NEXT_PUBLIC_BASE_URL_PRODUCTION}/verify`,
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

    console.log(response.data);

    return Response.json(response.data);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }));
  }
}
