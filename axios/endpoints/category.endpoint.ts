// import { LoginUserType, UserTypes } from "@types";
import $ from "../index";

type ResponsTypes = Promise<{
  error: boolean;
  serverResponse: {
    [key: string]: any;
  };
}>;

export function postCategory(id: any, data: any): ResponsTypes {
  return $({
    url: `/api/${id}/categories`,
    method: "post",
    data: data,
  });
}

export function patchCategory(id: any, data: any, otherId: any): ResponsTypes {
  return $({
    url: `/api/${id}/categories/${otherId}`,
    method: "patch",
    data: data,
  });
}

export function deleteCategory(id: any, otherId: any): ResponsTypes {
  return $({
    url: `/api/${id}/categories/${otherId}`,
    method: "delete",
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
