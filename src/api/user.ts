import { http } from "@/utils/http";

export type USER = {
  id: string;
  username: string;
  password: string;
  email: string;
  avatar: string;
  ip: string;
  address: string;
  system: string;
  createdAt: Date;
};

export type UserResult = {
  success: boolean;
  data: USER;
  code: number;
  message: string;
};

export type UserListResult = {
  success: boolean;
  code: number;
  message: string;
  data: {
    count: number;
    list: USER[];
  };
};

export type RefreshTokenResult = {
  success: boolean;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

type USERQUERY = {
  username?: string;
  email?: string;
  page?: number;
  page_size?: number;
  start_time?: string;
  end_time?: string;
  state?: number;
};

// 获取用户列表
export const getUserList = (data?: USERQUERY) => {
  return http.request<UserListResult>("post", "/user/list", { data });
};

// 创建用户
export const createUser = (data?: USER) => {
  return http.request<UserResult>("post", "/user/create", { data });
};

// 更新用户
export const updateUser = (data?: USER) => {
  return http.request<UserResult>("post", `/user/update`, { data });
};

// 删除用户
export const deleteUser = (ids: string[]) => {
  return http.request<UserResult>("post", `/user/delete`, { data: { ids } });
};

// 重置密码
export const resetPassword = data => {
  return http.request<UserResult>("post", `/user/reset_password`, { data });
};
