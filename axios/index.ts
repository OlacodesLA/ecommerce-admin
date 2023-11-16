import Cookies from "js-cookie";
import axios, { AxiosRequestConfig } from "axios";
import Router from "next/router";
import toast from "react-hot-toast";

const isDevelopment = process.env.NEXT_PUBLIC_NODE_ENV === "development";

let baseURL;

if (isDevelopment) {
  baseURL = process.env.NEXT_PUBLIC_LOCAL;
} else {
  baseURL = process.env.NEXT_PUBLIC_PRODUCTION;
}

const service = axios.create({
  baseURL,
  headers: {
    // "X-API-KEY": "idris",
    // "iden-unique_key": "quadraple-and-hello-edfojoidfj",
  },
});

export function getToken() {
  let token = Cookies.get("session");
  if (token) {
    return token;
  } else {
    return false;
  }
}
export function removeToken() {
  Cookies.remove("session");
  // console.log("token set");

  return true;
}

export function hasToken() {
  let token = Cookies.get("session");
  if (token) {
    return true;
  } else {
    return false;
  }
}

// request interceptor
service.interceptors.request.use(
  // @ts-ignore
  async (config: AxiosRequestConfig) => {
    if (config.headers === undefined) {
      config.headers = {};
    }

    if (hasToken() && getToken() !== false) {
      // config.headers.Authorization = `Bearer ${token}`;
      config.headers.Authorization = `Bearer ${String(getToken())}`;
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
service.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  }
);
export default service;
