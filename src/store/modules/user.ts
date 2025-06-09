import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";
import type { UserResult } from "@/api/user";
import { useMultiTagsStoreHook } from "./multiTags";
import {
  type DataInfo,
  removeToken,
  userKey,
  TokenKey,
  setRemembered,
  getRemembered
} from "@/utils/auth";
import { login } from "@/api/Login";
import { message } from "@/utils/message";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    userInfo: storageLocal().getItem<DataInfo<userType>>(userKey) || {},
    remembered: getRemembered()
  }),
  actions: {
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.remembered.isRemembered = bool;
    },
    SET_USERINFO(data: DataInfo<userType>) {
      this.userInfo = data;
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise<UserResult>((resolve, reject) => {
        login(data)
          .then((res: any) => {
            if (res.code === 200) {
              const { token, user } = res.data;
              storageLocal().setItem(userKey, { ...user });
              storageLocal().setItem(TokenKey, token);
              if (this.remembered.isRemembered) {
                setRemembered({
                  ...data
                });
              }
              this.SET_USERINFO({ ...user });
              resolve(res);
            } else {
              // 登录失败
              // 提示错误信息
              message(res.msg, { type: "error" });
              reject(res);
            }
          })
          .catch(err => {
            console.log(err);
            reject(err);
          });
      });
    },
    /** 前端登出（不调用接口） */
    logOut() {
      this.userInfo = {};
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
