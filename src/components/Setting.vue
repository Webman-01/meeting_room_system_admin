<!-- 右下角浮动按钮 -->
<template>
  <a-float-button-group
    trigger="click"
    type="default"
    :style="{ right: '24px' }"
  >
    <!-- 点击按钮的图标 -->
    <template #icon>
      <icon-font type="icon-mofabang" />
    </template>
    <a-float-button @click="toggleTheme" tooltip="暗黑模式">
      <template #icon>
        <icon-font type="icon-moon-o" />
      </template>
    </a-float-button>
    <a-float-button tooltip="全屏显示" @click="showFullScreen">
      <template #icon>
        <icon-font type="icon-fangda" style="color: grey;" />
      </template>
    </a-float-button>
    <a-float-button tooltip="主题设置">
      <template #icon>
        <Modal/>
      </template>
    </a-float-button>
  </a-float-button-group>
</template>

<script setup lang="ts">
import { createFromIconfontCN } from "@ant-design/icons-vue";
import { theme } from "ant-design-vue";
import { useThemeStore } from "../stores/themeToggle";
import Modal from '../components/Modal.vue'
const IconFont = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/c/font_3374371_ea469y7fe3j.js",
});
//引入pinia
const themeToggle = useThemeStore();
//切换深浅色模式
const toggleTheme = () => {
  //如果是默认样式就切换成暗黑模式
  if (themeToggle.themeData == theme.defaultAlgorithm) {
    themeToggle.themeData = theme.darkAlgorithm;
    themeToggle.themeColor = "white";
  } else {
    themeToggle.themeData = theme.defaultAlgorithm;
    themeToggle.themeColor = "black";
  }
  //@ts-ignore
  document.startViewTransition(() => {
    document.documentElement.classList.toggle("dark");
  });
};
//全屏
const showFullScreen = ()=>{
    const fullScreen = document.fullscreenElement
    if(!fullScreen){
        document.documentElement.requestFullscreen()
    }else{
        document.exitFullscreen()
    }
}
//主题定
</script>

<style lang="scss">
::view-transition-old(*) {
  animation: none;
  mix-blend-mode: normal;
}
.dark::view-transition-old(*) {
  animation: none;
  mix-blend-mode: normal;
}
::view-transition-new(*) {
  mix-blend-mode: normal;
  animation: clip-dark 1s ease-in;
}
.dark::view-transition-new(*) {
  mix-blend-mode: normal;
  animation: clip-light 1s ease-in;
}
.dark {
  background-color: rgb(20, 20, 20);
  color-scheme: dark;
}
@keyframes clip-light {
  from {
    clip-path: polygon(-30% 0, -30% 0, -15% 100%, -10% 115%);
  }
  to {
    clip-path: polygon(-30% 0, 130% 0, 115% 100%, -10% 115%);
  }
}
@keyframes clip-dark {
  from {
    clip-path: polygon(130% 0, 130% 0, 115% 100%, 110% 115%);
  }
  to {
    clip-path: polygon(130% 0, -30% 0, -15% 100%, 110% 115%);
  }
}
</style>
