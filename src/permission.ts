import nprogress from "nprogress";
import "nprogress/nprogress.css";
import router from "./router";
import type { RouteLocationNormalized } from "vue-router";
import { refreshToken } from "./utils/interfaces";

import { message } from "ant-design-vue";

//导航发生前执行
router.beforeEach(
  async (
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    next: Function
  ) => {
    nprogress.start();
    const access_token = localStorage.getItem("access_token");
    if (!access_token) {
      if (to.path == "/login") {
        next();
      } else {
        next("/login");
      }
    } else {
      const res = await refreshToken();
      if (res.status == 401) {
        message.error("登录过期");
        localStorage.clear();
        next("/login");
      } else {
        next();
      }
    }
  }
);
router.afterEach(() => {
  nprogress.done();
});
