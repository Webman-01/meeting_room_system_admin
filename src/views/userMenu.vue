<template>
  <div class="menu-container">
    <div class="menu">
      <a-menu
        v-model:openKeys="state.openKeys"
        :selectedKeys="state.selectedKeys"
        mode="inline"
        theme="light"
        :inline-collapsed="state.collapsed"
        :items="items"
        @click="changeRoute"
      >
      </a-menu>
    </div>
    <div class="userMange">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, h, onMounted, watchEffect } from "vue";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";
import router from "@/router";
import { useRoute, useRouter } from "vue-router";
const state = reactive({
  collapsed: false,
  selectedKeys: ["1"],
  openKeys: ["sub1"],
  preOpenKeys: ["sub1"],
});
const items = reactive([
  {
    key: "1",
    icon: () => h(PieChartOutlined),
    label: "信息修改",
    title: "信息修改",
  },
  {
    key: "2",
    icon: () => h(DesktopOutlined),
    label: "密码修改",
    title: "密码修改",
  },
]);
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  }
);
const $router = useRouter();
const $route = useRoute();
//挂载后根据路由来渲染选中的是菜单栏中哪个
watchEffect(() => {
  state.selectedKeys = $route.path == "/userMenu/info_modify" ? ["1"] : ["2"];
});
//点击左边栏跳转路由
const changeRoute = (e: any) => {
  //获取事件对象
  console.log(e);
  state.selectedKeys[0] = e.key;
  if (e.key == "1") {
    $router.push("/userMenu/info_modify");
  } else {
    $router.push("/userMenu/password_modify");
  }
};
</script>
<style lang="scss" scoped>
.menu-container {
  display: flex;
  .menu {
    width: 256px;
  }
  .userMange {
    padding: 25px;
  }
}
</style>
