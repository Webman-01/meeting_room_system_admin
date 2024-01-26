<template>
  <div class="layout">
    <div class="header">
      <!-- 顶部导航栏左侧的字 -->
      <router-link to="/">
        <h1>会议室预订系统-后台管理</h1>
      </router-link>
      <!-- 顶部导航栏右侧头像 -->
      <router-link to="/userMenu/info_modify">
        <!-- 头像组件 -->
        <a-avatar class="icon" :src="getImageUrl()" :size="50"> </a-avatar>
      </router-link>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
//获取图片静态路径
function getImageUrl() {
  const avatarInfo = JSON.parse(localStorage.getItem("user_info") as string);
  const avatar = avatarInfo.avatar;
  return "http://localhost:3000/" + avatar;
}
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
      color: #000;
    }
    a {
      text-decoration: none;
    }
  }
}
</style>
