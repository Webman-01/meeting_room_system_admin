<template>
  <div class="layout">
    <div class="header">
      <router-link to="/">
        <h1>会议室预订系统-后台管理</h1>
      </router-link>
      <router-link to="/userMenu/info_modify"
        ><UserOutlined class="icon"
      />
    </router-link>
    </div>
    <div class="body">
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup lang="ts">
import { UserOutlined } from "@ant-design/icons-vue";
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
    .icon {
      font-size: 40px;
      color: #000;
    }
    h1 {
      text-decoration: none;
      color: #000;
    }
    a{
      text-decoration: none;
    }
  }
}
</style>
