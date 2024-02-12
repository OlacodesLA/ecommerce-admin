import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
//Go to your firebase project console ie the firebase site > project settings > service accounts tab > generate new private key button
//save the file > rename it service_account.json > put in the root of this project

const firebaseAdminConfig = {
  credential: cert({
    privateKey: process.env.GSUITE_PRIVATE_KEY
      ? process.env.GSUITE_PRIVATE_KEY.replace(/\\n/gm, "\n")
      : undefined,
    clientEmail:
      "firebase-adminsdk-sejap@irolagos-store.iam.gserviceaccount.com",
    projectId: "irolagos-store",
  }),
};

const app =
  getApps().length <= 0 ? initializeApp(firebaseAdminConfig) : getApps()[0];

export const adminAuth = getAuth(app);
