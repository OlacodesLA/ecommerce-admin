// import { LoginUserType, UserTypes } from "@types";
import $ from "../index";

type ResponsTypes = Promise<{
  data: any;
  error: boolean;
  serverResponse: {
    [key: string]: any;
  };
}>;

export function getStore(data: any): ResponsTypes {
  return $({
    url: `/api/stores`,
    method: "post",
    data: data,
  });
}

export function updateStore(id: any, data: any): ResponsTypes {
  return $({
    url: `/api/stores/${id}`,
    method: "patch",
    data: data,
  });
}

export function deleteStore(id: any): ResponsTypes {
  return $({
    url: `/api/stores/${id}`,
    method: "delete",
  });
}
