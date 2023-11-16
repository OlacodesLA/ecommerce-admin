// import { LoginUserType, UserTypes } from "@types";
import $ from "../index";

type ResponsTypes = Promise<{
  error: boolean;
  serverResponse: {
    [key: string]: any;
  };
}>;

export function postSize(id: any, data: any): ResponsTypes {
  return $({
    url: `/api/${id}/sizes`,
    method: "post",
    data: data,
  });
}

export function patchSize(id: any, data: any, otherId: any): ResponsTypes {
  return $({
    url: `/api/${id}/sizes/${otherId}`,
    method: "patch",
    data: data,
  });
}

export function deleteSize(id: any, otherId: any): ResponsTypes {
  return $({
    url: `/api/${id}/sizes/${otherId}`,
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
