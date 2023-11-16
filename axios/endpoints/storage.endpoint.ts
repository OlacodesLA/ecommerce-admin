// import { LoginUserType, UserTypes } from "@types";
import $ from "../index";

type ResponsTypes = Promise<{
  error: boolean;
  serverResponse: {
    [key: string]: any;
  };
}>;

export function postImage(id: any, data: any): ResponsTypes {
  return $({
    url: `/api/${id}/billboards`,
    method: "post",
    data: data,
  });
}
export function patchImage(id: any, data: any, otherId: any): ResponsTypes {
  return $({
    url: `/api/${id}/billboards/${otherId}`,
    method: "patch",
    data: data,
  });
}
export function deleteBillboard(id: any, otherId: any): ResponsTypes {
  return $({
    url: `/api/${id}/billboards/${otherId}`,
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
