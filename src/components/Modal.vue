<!-- 主题设置的弹出框 -->
<template>
  <div>
    <icon-font
      type="icon-yanliao"
      @click="showModal"
      style="color: yellowgreen"
    />
    <!-- eslint-disable vue/no-v-model-argument -->
    <a-modal v-model:open="open" title="主题颜色" @ok="handleOk">
      <div class="color">
        <a-button
          style="background-color: #1677ff; color: aliceblue"
          @click="color.themeCss = '#1677ff'"
          >蓝色</a-button
        >
        <a-button
          style="background-color: #00b96b; color: aliceblue"
          @click="color.themeCss = '#00b96b'"
          >绿色</a-button
        >
        <a-button
          style="background-color: #fadb14; color: aliceblue"
          @click="color.themeCss = '#FADB14'"
          >黄色</a-button
        >
        <a-button
          style="background-color: #fa8c16; color: aliceblue"
          @click="color.themeCss = '#FA8C16'"
          >橙色</a-button
        >
        <a-button
          style="background-color: #a0d911; color: aliceblue"
          @click="color.themeCss = '#A0D911'"
          >荧光</a-button
        >
        <a-button
          style="background-color: #b87333; color: aliceblue"
          @click="color.themeCss = '#b87333'"
          >棕色</a-button
        >
        <a-button
          style="background-color: #f5222d; color: aliceblue"
          @click="color.themeCss = '#F5222D'"
          >红色</a-button
        >
        <a-button
          style="background-color: #8A2BE2; color: aliceblue"
          @click="color.themeCss = '#8A2BE2'"
          >紫色</a-button
        >
        <a-button
          style="background-color: #1e9a9e; color: aliceblue"
          @click="color.themeCss = '#1e9a9e'"
          >青色</a-button
        >
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { createFromIconfontCN } from "@ant-design/icons-vue";
import { ref } from "vue";
import { useThemeStore } from "../stores/themeToggle";
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_3374371_ea469y7fe3j.js",
});
const open = ref<boolean>(false);
const color = useThemeStore();

const showModal = () => {
  open.value = true;
};

const handleOk = (e: MouseEvent) => {
  open.value = false;
};
</script>
<style lang="scss" scoped>
.color {
  width: 350px;
  display: flex;
  flex-wrap: wrap;
  .ant-btn {
    margin: 15px;
  }
}
</style>
