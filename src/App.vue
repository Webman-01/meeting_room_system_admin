<script setup lang="ts">
import dayjs from "dayjs";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { ref } from "vue";
//中文化
const locale = ref(zhCN);
dayjs.locale("zh-cn");
</script>

<template>
 <div>
  <a-config-provider :locale="locale">
    <router-view></router-view>
  </a-config-provider>
 </div>
</template>

<style scoped>
</style>
