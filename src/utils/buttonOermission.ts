import { useRoute } from "vue-router";
// 判断是否有权限
export const isAuth = (_auth: string) => {
  return true;
  // const route = useRoute();
  // return !auth || route.meta.auths?.includes(auth);
};

// 判断是否有权限
export const isAuths = (auths: string[]) => {
  const route = useRoute();
  const hasAuths = auths.some(auth => route.meta.auths?.includes(auth));
  return hasAuths;
};

// 菜单管理按钮权限枚举
export enum MenuButtonEnum {
  "添加" = "add",
  "编辑" = "edit",
  "删除" = "delete"
}

// 菜单管理按钮权限枚举
export enum UserButtonEnum {
  "添加" = "add",
  "编辑" = "edit",
  "删除" = "delete"
}
