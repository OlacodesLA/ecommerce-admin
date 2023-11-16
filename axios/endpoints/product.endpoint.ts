// import { LoginUserType, UserTypes } from "@types";
import $ from "../index";

type ResponsTypes = Promise<{
  error: boolean;
  serverResponse: {
    [key: string]: any;
  };
}>;

export function postProduct(id: any, data: any): ResponsTypes {
  return $({
    url: `/api/${id}/products`,
    method: "post",
    data: data,
  });
}

export function patchProduct(id: any, data: any, otherId: any): ResponsTypes {
  return $({
    url: `/api/${id}/products/${otherId}`,
    method: "patch",
    data: data,
  });
}

export function deleteProduct(id: any, otherId: any): ResponsTypes {
  return $({
    url: `/api/${id}/products/${otherId}`,
    method: "delete",
  });
}

export function getProducts(id: any): ResponsTypes {
  return $({
    url: `/api/${id}/products`,
    method: "get",
  });
}

// export function updateStore(id: any, data: any): ResponsTypes {
//   return $({
//     url: `/api/stores/${id}`,
//     method: "patch",
//     data: data,
//   });
// }

// export function deleteStore(id: any): ResponsTypes {
//   return $({
//     url: `/api/stores/${id}`,
//     method: "delete",
//   });
// }
