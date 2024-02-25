import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/login",
      name: "login",
      component: () => import("../views/login.vue"),
    },
    {
      path: "/",
      name: "index",
      component: () => import("../views/index.vue"),
      children: [
        {
          path: "",
          name: "menu",
          component: () => import("../views/menu.vue"),
          children: [
            {
              path: "user_manage",
              name: "userManage",
              component: () => import("../views/manage/userMange.vue"),
            },
            {
              path: "meeting_room_manage",
              name: "meetingRoomManage",
              component: () => import("../views/manage/meetingRoomManage.vue"),
            },
            {
              path: "booking_manage",
              name: "bookingManage",
              component: () => import("../views/manage/bookingManage.vue"),
            },
            {
              path: "statistics",
              name: "statistics",
              component: () => import("../views/manage/statistics.vue"),
            },
          ],
        },
        {
          path: "userMenu",
          name: "userMenu",
          component: () => import("../views/userInfo/userMenu.vue"),
          children: [
            {
              path: "info_modify",
              name: "infoModify",
              component: () => import("../views/userInfo/infoModify.vue"),
            },
            {
              path: "password_modify",
              name: "passwordModify",
              component: () => import("../views/userInfo/passwordModify.vue"),
            },
          ],
        },
      ],
    },
    {
      path: "/404",
      name: "error",
      component: () => import("../views/404.vue"),
    },
    {
      //任意路由重定向到404
      path: "/:pathMatch(.*)*", //匹配所有路径
      redirect: "/404",
      name: "any",
    },
  ],
});

export default router;
