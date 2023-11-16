import { collection, doc } from "firebase/firestore";
import { db } from "../config/firebase";

export const usersCollectionRef = collection(db, "users");
