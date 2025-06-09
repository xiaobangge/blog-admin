import "@/utils/sso";
// import { getConfig } from "@/config";
import NProgress from "@/utils/progress";
// import { transformI18n } from "@/plugins/i18n";
import { buildHierarchyTree } from "@/utils/tree";
import remainingRouter from "./modules/remaining";
import { useMultiTagsStoreHook } from "@/store/modules/multiTags";
import { usePermissionStoreHook } from "@/store/modules/permission";
import { isUrl, openLink, storageLocal, isAllEmpty } from "@pureadmin/utils";
import {
  ascending,
  getTopMenu,
  initRouter,
  // isOneOfArray,
  getHistoryMode,
  findRouteByPath,
  handleAliveRoute,
  formatTwoStageRoutes,
  formatFlatteningRoutes
} from "./utils";
import {
  type Router,
  createRouter,
  type RouteRecordRaw,
  type RouteComponent
} from "vue-router";
import { type DataInfo, userKey, removeToken } from "@/utils/auth";

/** 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 * 如何匹配所有文件请看：https://github.com/mrmlnc/fast-glob#basic-syntax
 * 如何排除文件请看：https://cn.vitejs.dev/guide/features.html#negative-patterns
 */
const modules: Record<string, any> = import.meta.glob(
  ["./modules/**/*.ts", "!./modules/**/remaining.ts"],
  {
    eager: true
  }
);

/** 原始静态路由（未做任何处理） */
const routes = [];

Object.keys(modules).forEach(key => {
  routes.push(modules[key].default);
});
/** 导出处理后的静态路由（三级及以上的路由全部拍成二级） */
export const constantRoutes: Array<RouteRecordRaw> = formatTwoStageRoutes(
  formatFlatteningRoutes(buildHierarchyTree(ascending(routes.flat(Infinity))))
);

/** 用于渲染菜单，保持原始层级 */
export const constantMenus: Array<RouteComponent> = ascending(
  routes.flat(Infinity)
).concat(...remainingRouter);

/** 不参与菜单的路由 */
export const remainingPaths = Object.keys(remainingRouter).map(v => {
  return remainingRouter[v].path;
});

/** 创建路由实例 */
export const router: Router = createRouter({
  history: getHistoryMode(import.meta.env.VITE_ROUTER_HISTORY),
  routes: constantRoutes.concat(...(remainingRouter as any)),
  strict: true,
  scrollBehavior(to, from, savedPosition) {
    return new Promise(resolve => {
      if (savedPosition) {
        return savedPosition;
      } else {
        if (from.meta.saveSrollTop) {
          const top: number =
            document.documentElement.scrollTop || document.body.scrollTop;
          resolve({ left: 0, top });
        }
      }
    });
  }
});

/** 重置路由 */
export function resetRouter() {
  try {
    const permissionStore = usePermissionStoreHook();
    // 移除所有后台路由
    // 只移除带有 meta?.backstage 的路由
    const routesToRemove = router
      .getRoutes()
      .filter(
        route =>
          route?.name && router.hasRoute(route.name) && route.meta?.backstage
      );
    routesToRemove.forEach(route => {
      router.hasRoute(route.name) && router.removeRoute(route.name);
    });

    // 重建路由配置
    const formattedRoutes = formatTwoStageRoutes(
      formatFlatteningRoutes(
        buildHierarchyTree(ascending(routes.flat(Infinity)))
      )
    );
    router.options.routes = formattedRoutes;

    // 清除所有缓存页面
    permissionStore.clearAllCachePage();
  } catch (error) {
    console.error("重置路由时发生错误: ", error);
  }
}

/** 路由白名单 */
const whiteList = ["/login"];

// const { VITE_HIDE_HOME } = import.meta.env;

router.beforeEach((to: ToRouteType, _from, next) => {
  const permissionStore = usePermissionStoreHook();
  if (to.meta?.keepAlive) {
    handleAliveRoute(to, "add");
    // 页面整体刷新和点击标签页刷新
    if (_from.name === undefined || _from.name === "Redirect") {
      handleAliveRoute(to);
    }
  }
  const userInfo = storageLocal().getItem<DataInfo<number>>(userKey);
  NProgress.start();
  const externalLink = isUrl(to?.name as string);
  if (!externalLink) {
    to.matched.some(item => {
      if (!item.meta.title) return "";
    });
  }
  // /** 如果已经登录并存在登录信息后不能跳转到路由白名单，而是继续保持在当前页面 */
  function toCorrectRoute() {
    // 获取后台路由中没有父级的子路由
    const routes = router.options.routes[0];
    // 检查即将导航到的路由是否为 '/welcome/index'，且该路由不存在，并且当前路由不是根路由
    const hasRoute = routes.children.find(rr => rr.path === to.path);
    if (
      ((to.fullPath === "/welcome" && !hasRoute) ||
        to.fullPath === "/error/404") &&
      _from.fullPath !== "/"
    ) {
      // 如果当前路由是从 '/login' 导航过来的
      if (_from?.fullPath === "/login") {
        // 获取后台路由中没有父级的子路由
        const routes2 = routes.children.filter(
          (v: any) => v.meta?.backstage && !v?.parentId
        );
        // 导航到第一个后台路由的路径
        next({ path: routes2[0].path });
      } else {
        // 否则导航到 404 页面
        next();
      }
    } else {
      // 如果即将导航到的路由在白名单中，则导航回上一个路由，否则继续导航
      next();
      // whiteList.includes(to.fullPath) ? next(_from.fullPath) : next();
    }
  }

  if (userInfo) {
    function nextRouter() {
      if (!useMultiTagsStoreHook().getMultiTagsCache) {
        const { path } = to;
        const route = findRouteByPath(path, router.options.routes[0].children);
        getTopMenu(true);
        // query、params模式路由传参数的标签页不在此处处理
        if (route && route.meta?.title) {
          if (isAllEmpty(route.parentId) && route.meta?.backstage) {
            // 此处为动态顶级路由（目录）
            if (route.children[0]) {
              const { path, name, meta } = route.children[0] || {};
              useMultiTagsStoreHook().handleTags("push", {
                path,
                name,
                meta
              });
            }
          } else {
            const { path, name, meta } = route;
            useMultiTagsStoreHook().handleTags("push", {
              path,
              name,
              meta
            });
          }
        }
      }
      if (permissionStore.wholeMenus.length === 0) {
        next();
      } else {
        if (isAllEmpty(to.name))
          // 确保动态路由完全加入路由列表并且不影响静态路由（注意：动态路由刷新时router.beforeEach可能会触发两次，第一次触发动态路由还未完全添加，第二次动态路由才完全添加到路由列表，如果需要在router.beforeEach做一些判断可以在to.name存在的条件下去判断，这样就只会触发一次）
          router.push(to.fullPath);
        toCorrectRoute();
      }
    }
    if (_from?.name && _from.name !== "Login") {
      // name为超链接
      if (externalLink) {
        openLink(to?.name as string);
        NProgress.done();
      } else {
        toCorrectRoute();
      }
    } else {
      // 刷新
      if (permissionStore.wholeMenus.length === 0 && to.path !== "/login") {
        initRouter().then(() => {
          nextRouter();
        });
      } else if (_from?.name === "Login") {
        // console.log("登录成功，重新初始化路由", router.getRoutes());
        nextRouter();
      } else toCorrectRoute();
    }
  } else {
    if (to.path !== "/login") {
      if (whiteList.indexOf(to.path) !== -1) {
        next();
      } else {
        removeToken();
        next({ path: "/login" });
      }
    } else {
      next();
    }
  }
});

router.afterEach(() => {
  NProgress.done();
});

export default router;
