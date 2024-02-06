//@ts-nocheck
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

// Trigram generation function
const triGram = (txt) => {
  const map = {};
  const s1 = (txt || "").toLowerCase();
  const n = 3;
  for (let k = 0; k <= s1.length - n; k++) map[s1.substring(k, k + n)] = true;
  return map;
};

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { storeId: string; query?: string };
  }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("Store id is Required", { status: 400 });
    }

    // Optional: Get the search query from the request parameters
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get("query");
    const capSearchQuery = capitalizeFirstLetter(searchQuery ?? "");

    // Generate trigrams for the search query
    const trigrams = triGram(capSearchQuery);

    // Query Firestore for products in the specified storeId matching the search query
    const nameQuery = query(collection(db, "product"), orderBy("name", "desc"));

    const descriptionQuery = query(
      collection(db, "product"),
      orderBy("description", "desc")
    );

    // Execute the queries and retrieve the results
    const [nameQuerySnapshot, descriptionQuerySnapshot] = await Promise.all([
      getDocs(nameQuery),
      getDocs(descriptionQuery),
    ]);

    // Filter results based on trigrams and make them unique
    const uniqueResults = new Set();

    filterAndAddToSet(nameQuerySnapshot, trigrams, uniqueResults);
    filterAndAddToSet(descriptionQuerySnapshot, trigrams, uniqueResults);

    // Convert Set back to an array
    const searchResults = Array.from(uniqueResults);

    return new NextResponse(JSON.stringify(searchResults), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[SEARCH_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

function capitalizeFirstLetter(str: string) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

function filterAndAddToSet(querySnapshot, trigrams, resultSet) {
  querySnapshot.docs.forEach((doc) => {
    const product = { id: doc.id, ...doc.data() };
    const productTrigrams = triGram(
      [product.name || "", product.description || ""].join(" ")
    );

    // Check if the product's unique identifier is already in the set before adding
    if (
      !resultSet.has(product.id) &&
      containsTrigrams(productTrigrams, trigrams)
    ) {
      resultSet.add(product.id);
      resultSet.add(product);
    }
  });
}

function containsTrigrams(productTrigrams, searchTrigrams) {
  // Add your logic to check if the product trigrams contain any of the search trigrams
  // For example, check if at least one trigram from searchTrigrams is present in productTrigrams
  for (const trigram in searchTrigrams) {
    if (productTrigrams.hasOwnProperty(trigram)) {
      return true;
    }
  }
  return false;
}
