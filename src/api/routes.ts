import { http } from "@/utils/http";

type Result = {
  success: boolean;
  data: Array<any>;
  code: number;
  msg: string;
};
export type Menu = {
  id: number;
  menu_name: string;
  menu_type: string;
  url: string;
  icon: string;
  parent_id: number;
  open_type: string;
  sort: number;
  visible: boolean;
};

export const getAsyncRoutes = () => {
  return http.request<Result>("post", "/menu/list");
};

export const postApiAdminMenuCreate = (data: Menu) => {
  return http.request<Result>("post", "/menu/create", { data });
};

export const postApiAdminMenuUpdate = (data: Menu) => {
  return http.request<Result>("post", "/menu/update", { data });
};

export const postApiAdminMenuRemove = (data: Menu) => {
  return http.request<Result>("post", "/menu/delete", { data });
};
