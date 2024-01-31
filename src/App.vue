<script setup lang="ts">
import dayjs from "dayjs";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { ref } from "vue";
import { useThemeStore } from "./stores/themeToggle";
import Setting from "./components/Setting.vue";

//中文化
const locale = ref(zhCN);
dayjs.locale("zh-cn");
const data = useThemeStore();
</script>

<template>
  <div>
    <a-config-provider
      :locale="locale"
      :theme="{
        algorithm: data.themeData,
        token:{colorPrimary: data.themeCss}
      }"
    >
      <Setting />
      <router-view></router-view>
    </a-config-provider>
  </div>
</template>

<style lang="scss"></style>
