<template>
  <a-config-provider
    :locale="locale"
    :theme="{
      algorithm: themeColor.themeData,
      token: { colorPrimary: themeColor.themeCss },
    }"
  >
    <Setting />
    <div class="layout">
      <div class="header">
        <!-- 顶部导航栏左侧的字 -->
        <router-link to="/meeting_room_manage">
          <h1 :style="{ color: themeColor.themeColor }">
            会议室预订系统-后台管理
          </h1>
        </router-link>
        <!-- 顶部导航栏右侧头像 -->
        <router-link to="/userMenu/info_modify">
          <!-- 头像组件 -->
          
            <!-- 下拉框 -->
            <a-dropdown placement="bottom">
              <!-- 头像展示 -->
              <a-avatar class="icon" :src="getImageUrl()" :size="50">
              </a-avatar>
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                   <div class="username">用户名: {{ username }}<br>昵称: {{ nickName }}</div>
                  </a-menu-item>
                  <a-menu-item>
                    <a href="javascript:;" @click="logout">退出登录</a>
                  </a-menu-item>
                </a-menu>
              </template>
            </a-dropdown>
         
        </router-link>
      </div>
      <div class="body">
        <router-view></router-view>
      </div>
    </div>
  </a-config-provider>
</template>
<script setup lang="ts">
import { useThemeStore } from "@/stores/themeToggle";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
import dayjs from "dayjs";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
import { ref, watchEffect } from "vue";
import { getUserInfo } from "@/utils/interfaces";

//中文化
const locale = ref(zhCN);
dayjs.locale("zh-cn");


//展示username和nickName
const username = ref<string>()
const nickName = ref<string>()
//获取用户信息
const getUserData = async()=>{
  const res =  await getUserInfo()
  const { data } = res.data
  
  if(res.status == 200 || res.status == 201){
    username.value = data.username
    nickName.value = data.nickName
  }else{
    throw Promise.reject(new Error())
  }
}
watchEffect(()=>{
  getUserData()
})
//获取图片静态路径
function getImageUrl() {
  const avatarInfo = JSON.parse(localStorage.getItem("user_info") as string);
  const avatar = avatarInfo.avatar;
  return "http://localhost:3000/" + avatar;
}
const themeColor = useThemeStore();
const router = useRouter();
//登出
const logout = () => {
  message.success("退出登录成功");
  //清空所有本地数据
  localStorage.clear();
  router.push("/login");
};
</script>

<style lang="scss" scoped>
.layout {
  height: 60px;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
    padding: 0px 40px;
    border-bottom: 1px solid #e6e8eb;
    h1 {
      text-decoration: none;
    }
    a {
      text-decoration: none;
    }
    
  }
}
</style>
