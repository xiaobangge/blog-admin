import { http } from "@/utils/http";
import { ElNotification } from "element-plus";

export type UserResult = {
  code: number;
  msg: string;
  success: boolean;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** `token` */
    token: string;
  };
};

export type RequestResult = {
  code?: number;
  data?: any;
  msg?: string;
  success?: boolean;
};

// 登录接口
export const login = (data: any) => {
  return http.request<UserResult>("post", "/user/login", { data });
};

// 注册接口
export const register = (data: any) => {
  return http.request<RequestResult>("post", "/user/register", { data });
};

// 发送验证码接口
export const sendCode = async (data: any) => {
  const res = await http.request<RequestResult>("post", "/user/sendMailCode", {
    data
  });
  if (res.code === 200) {
    ElNotification({
      title: "提示",
      message: "验证码已发送，请注意查收",
      type: "success"
    });
  }
};

// 忘记密码接口
export const forgetPassword = (data: any) => {
  return http.request<RequestResult>("post", "/user/sendMailCode", { data });
};
