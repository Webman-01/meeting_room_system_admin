<template>
  <div class="menu-container">
    <div class="menu">
      <a-menu
        v-model:openKeys="state.openKeys"
        v-model:selectedKeys="state.selectedKeys"
        mode="inline"
        theme="light"
        :inline-collapsed="state.collapsed"
        :items="items"
      ></a-menu>
    </div>
    <div class="userMange">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, h } from "vue";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";
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
    label: "会议室管理",
    title: "会议室管理",
  },
  {
    key: "2",
    icon: () => h(DesktopOutlined),
    label: "预订管理",
    title: "预订管理",
  },
  {
    key: "3",
    icon: () => h(InboxOutlined),
    label: "用户管理",
    title: "用户管理",
  },
  {
    key: "4",
    icon: () => h(InboxOutlined),
    label: "统计",
    title: "统计",
  },
]);
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  }
);
const toggleCollapsed = () => {
  state.collapsed = !state.collapsed;
  state.openKeys = state.collapsed ? [] : state.preOpenKeys;
};
</script>
<style lang="scss" scoped>
.menu-container {
  display: flex;
  .menu {
    width: 256px;
  }
  .userMange{
    padding: 25px;
  }
}
</style>
