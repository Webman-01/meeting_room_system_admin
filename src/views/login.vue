<template>
  <div class="login-container">
    <a-card
      style="
        width: 450px;
        height: 500px;
        border-radius: 20px;
        box-shadow: 0px 10px 25px #cac6c6;
      "
      :hoverable="true"
    >
      <h1 class="title" :style="{ color: themeColor.themeColor }">
        会议室预订系统
      </h1>
      <a-form
        :model="formState"
        :colon="false"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 20 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: usernameFlag, message: '请输入用户名' }]"
        >
          <!-- eslint-disable vue/no-v-model-argument -->
          <a-input
            v-model:value="formState.username"
            @change="changeUsername(formState.username)"
          />
        </a-form-item>

        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: passwordFlag, message: '请输入密码' }]"
        >
          <a-input-password
            v-model:value="formState.password"
            @change="changePassword(formState.password)"
          />
        </a-form-item>

        <a-form-item :label-col="{ span: 0 }" :wrapper-col="{ span: 24 }">
          <a-button type="primary" html-type="submit" style="width: 100px"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
    </a-card>
    <Special class="special"/>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from "vue";
import { message } from "ant-design-vue";
import { useRouter } from "vue-router";
//@ts-ignore
import { login } from "../utils/interfaces";
import { useThemeStore } from "@/stores/themeToggle";
import Special from "../components/Special.vue";

let $router = useRouter();

interface FormState {
  username: string;
  password: string;
}

const formState = reactive<FormState>({
  username: "",
  password: "",
});
const onFinish = async (values: FormState) => {
  const res = await login(values.username, values.password);

  const { code, message: msg, data } = res.data;
  if (res.status == 201 || res.status == 200) {
    message.success("登录成功");
    //登录成功跳到首页
    $router.push("/meeting_room_manage");

    //存储token
    localStorage.setItem("access_token", data.accessToken);
    localStorage.setItem("refresh_token", data.refreshToken);
    localStorage.setItem("user_info", JSON.stringify(data.userInfo));
  } else {
    message.error(res.data.data || "系统繁忙,请稍后再试");
  }
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};

const usernameFlag = ref<boolean>(true);
const passwordFlag = ref<boolean>(true);
const changeUsername = (requireString: string) => {
  usernameFlag.value = requireString.trim() === "";
};
const changePassword = (requireString: string) => {
  passwordFlag.value = requireString.trim() === "";
};
const themeColor = useThemeStore();
</script>

<style lang="scss" scoped>
.login-container {
  width: 400px;
  margin: 100px auto 0 auto;
  text-align: center;
  .link {
    display: flex;
    justify-content: space-between;
  }
}
.title {
  font-size: 30px;
  font-weight: bold;
  text-align: center;
  color: black;
  margin-bottom: 50px;
}
.special{
  z-index: -1;
  position: fixed;
  left: 0px;
  top: 50px;
}

</style>
