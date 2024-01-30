<script setup lang="ts">
import dayjs from "dayjs";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { ref } from "vue";
import { theme } from "ant-design-vue";
import { useThemeStore } from "./stores/themeToggle";
import { CustomerServiceOutlined, CommentOutlined } from '@ant-design/icons-vue';
import { createFromIconfontCN } from '@ant-design/icons-vue'
//中文化
const locale = ref(zhCN);
dayjs.locale("zh-cn");
const IconFont = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/c/font_3374371_ea469y7fe3j.js',
});

const themeColor = useThemeStore()
const data = ref(theme.defaultAlgorithm);

const toggleTheme = () => {
  //如果是默认样式就切换成暗黑模式
  if (data.value == theme.defaultAlgorithm) {
    data.value = theme.darkAlgorithm;
    themeColor.themeColor = 'white'
  } else {
    data.value = theme.defaultAlgorithm;
    themeColor.themeColor = 'black'
  }

  document.startViewTransition(() => {
      document.documentElement.classList.toggle("dark");
    });


};

</script>

<template>
  <div>
    <button @click="toggleTheme">222</button>
    <a-config-provider
      :locale="locale"
      :theme="{
        algorithm: data,
      }"
    >
      <router-view></router-view>
      <a-float-button-group trigger="click" type="default" :style="{ right: '24px' }">
    <!-- 点击按钮的图标 -->
    <template #icon>
      <icon-font type="icon-mofabang"/>
    </template>
    <a-float-button>
      <template #icon>
       <icon-font type="icon-moon-o"/>
      </template>
    </a-float-button>
    <a-float-button>
      <template #icon>
       <icon-font type="icon-fangda"/>
      </template>
    </a-float-button>
    <a-float-button>
      <template #icon>
       <icon-font type="icon-yanliao"/>
      </template>
    </a-float-button>
  </a-float-button-group>
    </a-config-provider>
  </div>
  
</template>

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
      background-color: rgb(20,20,20);
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
