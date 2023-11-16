import axios from "axios";

const checkAuth = async () => {
  try {
    const response = await axios.get("/api/auth");
    console.log("Test", response);
    return response.data;
  } catch (error) {
    console.error("Error checking user login status:", error);
    // throw new Error("Internal Server Error");
  }
};

export default checkAuth;
