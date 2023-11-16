import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { usersCollectionRef } from "@/utils/users";
import toast from "react-hot-toast";
import { IProfilePayload } from "@/interfaces/components/profile";
import { getFirebaseErrorMessage } from "@/utils/errorHandler";
import { db } from "@/config/firebase";

export const getUserById = async (userId: string) => {
  try {
    const userDocRef = doc(usersCollectionRef, userId);

    const userDocSnapshot = await getDoc(userDocRef);

    if (!userDocSnapshot.exists()) {
      // Document does not exist
      return null;
    }

    const userData: IProfilePayload = userDocSnapshot.data();

    return userData;
  } catch (error: any) {
    console.error("Error retrieving user:", { message: error.message }, error);
    const newError = getFirebaseErrorMessage(error.message);
    toast.error(newError);
    throw error;
  }
};

// export const getFirstDocument = async (
//   collectionName: string,
//   userId: string,
//   documentId: string
// ) => {
//   try {
//     // Step 1: Query the collection with the conditions (userId and documentId)
//     const userAndDocumentQuery = query(
//       collection(db, collectionName),
//       where("userId", "==", userId)
//     );

//     const userAndDocumentQuerySnapshot = await getDocs(userAndDocumentQuery);

//     // Step 2: Check if there are documents that match the first condition (userId)
//     if (!userAndDocumentQuerySnapshot.empty) {
//       // Loop through the documents to find the one that also matches the documentId
//       const newDocs = userAndDocumentQuerySnapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));

//       console.log(newDocs);
//       for (const docSnapshot of newDocs) {
//         if (docSnapshot.id === documentId) {
//           // Step 3: Fetch the document data
//           const docRef = doc(db, collectionName, docSnapshot.id);
//           const docSnap = await getDoc(docRef);

//           if (docSnap.exists()) {
//             return docSnap.data();
//           } else {
//             console.log("No such document!");
//           }
//         }
//       }
//       console.log("No document matching the documentId condition!");
//     } else {
//       console.log("No documents matching the first condition (userId)!");
//     }
//   } catch (error) {
//     console.error("Error fetching document: ", error);
//   }
// };

export const getFirstDocument = async (
  collectionName: string,
  userId: string,
  documentId: string
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists() && docSnap.data().userId === userId) {
      console.log("document found ");
      return docSnap.data();
    } else {
      console.log("Document does not exist or userId does not match!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
    return null;
  }
};

export const getFirstPublicDocument = async (
  collectionName: string,
  documentId: string
) => {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("document found ");
      return docSnap.data();
    } else {
      console.log("Document does not exist or userId does not match!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching document: ", error);
    return null;
  }
};

export const getUserDocuments = async (
  collectionName: string,
  userId: string
) => {
  try {
    const q = query(
      collection(db, collectionName),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching user documents:", error);
  }
};

export const getStoreDocuments = async (
  collectionName: string,
  storeId: string
) => {
  try {
    if (!storeId) {
      throw new Error("Invalid storeId");
    }

    const q = query(
      collection(db, collectionName),
      where("storeId", "==", storeId)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("No documents found for storeId:", storeId);
      return [];
    }

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching documents:", error);
    throw new Error("Failed to fetch documents");
  }
};

export const getBillboardsByStoreId = async (
  collectionName: string,
  storeId: string
) => {
  try {
    const billboardsCollectionRef = collection(db, collectionName);

    const q = query(
      billboardsCollectionRef,
      where("storeId", "==", storeId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching billboards by storeId:", error);
    return [];
  }
};

export async function getProductsByParams(storeId: any, criteria: any) {
  const productsCollection = collection(db, "product");
  let productsQuery = query(
    productsCollection,
    where("storeId", "==", storeId),
    orderBy("createdAt", "desc")
  );

  Object.entries(criteria).forEach(([key, value]) => {
    if (value !== undefined && !(key === "isFeatured" && value === false)) {
      productsQuery = query(productsQuery, where(key, "==", value));
    }
  });

  const productsSnapshot = await getDocs(productsQuery);

  return productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function getDocumentData(
  collectionName: string,
  documentId: string
) {
  const documentRef = doc(db, collectionName, documentId);
  const documentSnapshot = await getDoc(documentRef);

  return documentSnapshot.data();
}

export async function enhanceProductData(products: any) {
  const enhancedProducts = [];

  for (const product of products) {
    const { categoryId, colorId, sizeId } = product;

    const category = await getDocumentData("category", categoryId);
    const color = await getDocumentData("color", colorId);
    const size = await getDocumentData("size", sizeId);

    enhancedProducts.push({
      ...product,
      category,
      color,
      size,
    });
  }

  return enhancedProducts;
}
