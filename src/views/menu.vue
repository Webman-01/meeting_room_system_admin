<template>
  <div class="menu-container">
    <div class="menu">
      <a-menu
        :openKeys="state.openKeys"
        :selectedKeys="state.selectedKeys"
        mode="inline"
        theme="light"
        :inline-collapsed="state.collapsed"
        :items="items"
        @click="changeRoute"
      ></a-menu>
    </div>
    <div class="userMange">
      <router-view></router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, watch, h, watchEffect } from "vue";
import {
  PieChartOutlined,
  DesktopOutlined,
  InboxOutlined,
} from "@ant-design/icons-vue";
import { useRoute, useRouter } from "vue-router";
const state = reactive({
  collapsed: false,
  selectedKeys: ["0"],
  openKeys: ["sub0"],
  preOpenKeys: ["sub0"],
});
const items = reactive([
  {
    key: "0",
    icon: () => h(PieChartOutlined),
    label: "会议室管理",
    title: "会议室管理",
  },
  {
    key: "1",
    icon: () => h(DesktopOutlined),
    label: "预订管理",
    title: "预订管理",
  },
  {
    key: "2",
    icon: () => h(InboxOutlined),
    label: "用户管理",
    title: "用户管理",
  },
  {
    key: "3",
    icon: () => h(InboxOutlined),
    label: "统计",
    title: "统计",
  },
]);
const $router = useRouter();
const $route = useRoute()
watch(
  () => state.openKeys,
  (_val, oldVal) => {
    state.preOpenKeys = oldVal;
  }
);
//点击改变菜单栏
const changeRoute = (e:any)=>{
  //切换选中高亮
  state.selectedKeys[0] = e.key
  switch(e.key){
    case '0':
      $router.push('/meeting_room_manage')
      break
    case '1':
      $router.push('/booking_manage')
      break
    case '2':
      $router.push('/user_manage')
      break
    case '3':
      $router.push('/statistics')
      break
  }
}
watchEffect(() => {
  if($route.path == '/meeting_room_manage'){
    state.selectedKeys = ['0']
  }else if($route.path == '/booking_manage'){
    state.selectedKeys = ['1']
  }else if($route.path == '/user_manage'){
    state.selectedKeys = ['2']
  }else if($route.path == '/statistics'){
    state.selectedKeys = ['3']
  }
});
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
