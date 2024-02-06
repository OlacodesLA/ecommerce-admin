import { sendEmail } from "./config";
import NikeReceiptEmail from "./confirmation";
import { render } from "@react-email/render";

export const sendVerificationEmail = async (body: any) => {
  const { customerInfo } = body;
  console.log(process.env.NEXT_PUBLIC_GSUITE_CLIENT_ID);
  console.log(process.env.NEXT_PUBLIC_GSUITE_PRIVATE_KEY);

  try {
    await sendEmail({
      //@ts-ignore
      to: [customerInfo.email, "sales@irolagos.com"],
      subject: "Order Confirmation",
      html: render(NikeReceiptEmail({ ...body })),
    });

    return Response.json(true);
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error }));
  }
};
