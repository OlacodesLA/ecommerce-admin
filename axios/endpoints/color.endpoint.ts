// import { LoginUserType, UserTypes } from "@types";
import $ from "../index";

type ResponsTypes = Promise<{
  error: boolean;
  serverResponse: {
    [key: string]: any;
  };
}>;

export function postColor(id: any, data: any): ResponsTypes {
  return $({
    url: `/api/${id}/colors`,
    method: "post",
    data: data,
  });
}

export function patchColor(id: any, data: any, otherId: any): ResponsTypes {
  return $({
    url: `/api/${id}/colors/${otherId}`,
    method: "patch",
    data: data,
  });
}

export function deleteColor(id: any, otherId: any): ResponsTypes {
  return $({
    url: `/api/${id}/colors/${otherId}`,
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
