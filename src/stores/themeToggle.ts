import { defineStore } from "pinia";
import { ref } from "vue";
import { theme } from "ant-design-vue";
export const useThemeStore = defineStore("theme", {
  state: () => ({
    //标题颜色
    themeColor: "black",
    //深浅色模式切换
    themeData: ref(theme.defaultAlgorithm),
    //主题颜色
    themeCss: ref('#1677ff')
  }),
  actions: {},
});
