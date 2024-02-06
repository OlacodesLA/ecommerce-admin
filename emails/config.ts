import nodemailer from "nodemailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

// const YOUR_EMAIL_ADDRESS = "sales@irolagos.com";
const YOUR_EMAIL_ADDRESS = "zaccheausjide@gmail.com";

const smtpOptions = {
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    type: "OAuth2",
    user: YOUR_EMAIL_ADDRESS,
    serviceClient: process.env.NEXT_PUBLIC_GSUITE_CLIENT_ID || "",
    privateKey: process.env.NEXT_PUBLIC_GSUITE_PRIVATE_KEY || "",
  },
};

export const sendEmail = async (data: EmailPayload) => {
  //@ts-ignore
  const transporter = nodemailer.createTransport({
    ...smtpOptions,
  });

  return await transporter.sendMail({
    from: YOUR_EMAIL_ADDRESS,
    ...data,
  });
};
