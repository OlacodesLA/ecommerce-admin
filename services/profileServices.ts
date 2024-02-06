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

export async function getProductsByParams(
  storeId: string,
  criteria: {
    categories?: string[]; // Changed categoryId to categories and modified type to string[]
    colorId?: string[];
    sizeId?: string[];
    isFeatured?: boolean;
    isNew?: boolean;
    isSeason?: boolean;
  }
) {
  const productsCollectionRef = collection(db, "product");

  let baseQuery = query(productsCollectionRef, where("storeId", "==", storeId));

  if (criteria.categories && criteria.categories.length > 0) {
    // Check if categories exist and have length
    for (const categoryId of criteria.categories) {
      baseQuery = query(
        baseQuery,
        where("categories", "array-contains", categoryId) // Use "array-contains" to check if categoryId is in the array of categories
      );
    }
  }

  if (criteria.isFeatured !== undefined) {
    baseQuery = query(
      baseQuery,
      where("isFeatured", "==", criteria.isFeatured)
    );
  }
  if (criteria.isNew !== undefined) {
    baseQuery = query(baseQuery, where("isNew", "==", criteria.isNew));
  }

  if (criteria.isSeason !== undefined) {
    baseQuery = query(baseQuery, where("isSeason", "==", criteria.isSeason));
  }

  // Separate queries for colorId and sizeId
  const colorQuery =
    criteria.colorId && criteria.colorId.length > 0
      ? query(
          baseQuery,
          where("colorId", "array-contains-any", criteria.colorId)
        )
      : baseQuery;

  const sizeQuery =
    criteria.sizeId && criteria.sizeId.length > 0
      ? query(baseQuery, where("sizeId", "array-contains-any", criteria.sizeId))
      : baseQuery;

  // Execute both color and size queries and store the results
  const querySnapshotColor = await getDocs(colorQuery);
  const querySnapshotSize = await getDocs(sizeQuery);

  // Find common products between color and size queries
  const commonProducts = querySnapshotColor.docs.filter((colorDoc) =>
    querySnapshotSize.docs.some((sizeDoc) => sizeDoc.id === colorDoc.id)
  );

  // Extract and return the common products with IDs as an array
  const products: any[] = commonProducts.map((docSnapshot) => {
    const productData = docSnapshot.data() as any;
    return { id: docSnapshot.id, ...productData };
  });

  return products;
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
