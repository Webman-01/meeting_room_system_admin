<template>
  <div class="login-container">
    <a-form
      :model="formState"
      :colon="false"
      :label-col="{ span: 6 }"
      :wrapper-col="{ span: 18 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <!-- eslint-disable vue/no-v-model-argument -->
      <a-form-item
        label="头像"
        name="avatar"
        style="margin-top: 20px"
        :rules="[{ required: false, message: '请输入用户名' }]"
      >
        <!-- 头像组件 -->
        <Avatar ></Avatar>
      </a-form-item>

      <a-form-item
        label="昵称"
        name="nickName"
        v-model:value="formState.nickName"
      >
        <a-input v-model:value="formState.nickName"
      /></a-form-item>
      <a-form-item
        label="邮箱"
        name="email"
        v-model:value="formState.email"
        :rules="[{ type: 'email', message: '请输入正确的邮箱' }]"
      >
        <a-input v-model:value="formState.email" disabled />
      </a-form-item>

      <div class="captcha">
        <a-form-item
          :label-col="{ span: 0 }"
          :wrapper-col="{ span: 10 }"
          label="验证码"
          name="captcha"
          v-model:value="formState.captcha"
        >
          <a-input v-model:value="formState.captcha" />
        </a-form-item>
        <a-button type="primary" @click="sendCaptcha">发送验证码</a-button>
      </div>

      <a-form-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
        <a-button
          type="primary"
          html-type="submit"
          style="width: 150px; margin-top: 30px"
          >更新</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
import { reactive, watchEffect } from "vue";
import {
  getUserInfo,
  updateUserInfo,
  updateUserInfoCaptcha,
} from "../../utils/interfaces";
import { message } from "ant-design-vue";
import Avatar from "../../updateInfoAvatar/avatar.vue";

import type { UserInfo } from "../../types/user.types";
import { useAvatarInfoStore } from "@/stores/avatarInfo";

//从pinia中引入头像数据
let avatarInfo = useAvatarInfoStore();

const formState = reactive<UserInfo>({
  nickName: "",
  avatar: "",
  email: "",
  captcha: "",
});

//提交时回调
const onFinish = async (values: UserInfo) => {
  //因为Avatar组件中只是修改了pinia仓库中的avatarUrl,这里的formState中avatar不会变，所以在传数据时要改下这个组件中formState.avatar的值
  values.avatar = avatarInfo.avatarUrl;
  const res = await updateUserInfo(values);
  const { message: msg, data } = res.data;
  console.log(res);

  if (res.status == 200 || res.status == 201) {
    message.success("更新用户信息成功");
    const userInfo = JSON.parse(localStorage.getItem("user_info") as string);
    //values.avatar是最新的，不能用formState
    userInfo.avatar = values.avatar;
    localStorage.setItem('user_info',JSON.stringify(userInfo))
   
    
    //验证码置空
    formState.captcha = "";
  } else {
    message.error(data || "系统繁忙,请稍后再试");
  }
};
//发送验证码
async function sendCaptcha() {
  const res = await updateUserInfoCaptcha(); //直接根据jwt中的email发,不用传参数
  // console.log(res);
  if (res.status == 200 || res.status == 201) {
    message.success(res.data.data);
  } else {
    message.error("系统繁忙,请稍后再试");
  }
}

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
//挂载时开始监听把当前的用户信息展示在表格中
watchEffect(async () => {
  try {
    const res = await getUserInfo();
    const { data } = res.data;
    // console.log(data, "userInfo");
    //判断响应码是否正确
    if (res.status == 200 || res.status == 201) {
      formState.avatar = data.avatar;
      avatarInfo.$patch({ avatarUrl: formState.avatar }); //把avatar的值存一份到pinia中
      formState.nickName = data.nickName;
      formState.email = data.email;
    }
  } catch (error) {
    throw error;
  }
});
</script>

<style lang="scss" scoped>
.login-container {
  width: 400px;
  margin: 50px auto 0 auto;
  margin-left: 80px;
  text-align: center;
  .link {
    display: flex;
    justify-content: flex-end;
  }
  .captcha {
    display: flex;
    justify-content: flex-end;
  }
}
.title {
  margin-left: 10px;
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: black;
  margin-bottom: 30px;
}
</style>
