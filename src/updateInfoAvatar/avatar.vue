<template>
  <div>
    <a-upload
      name="file"
      list-type="picture-card"
      class="avatar-uploader"
      :show-upload-list="false"
      action="http://localhost:3000/user/upload"
      @change="handleChange"
    >
      <img
        v-if="useAvatarInfo.$state.avatarUrl"
        :src="getImageUrl(useAvatarInfo.$state.avatarUrl)"
        alt="avatar"
        width="100"
        height="100"
      />
      <div v-else>
        <loading-outlined v-if="loading"></loading-outlined>
        <plus-outlined v-else></plus-outlined>
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import { useAvatarInfoStore } from "@/stores/avatarInfo";

const loading = ref<boolean>(false);
let useAvatarInfo = useAvatarInfoStore();
function getImageUrl(fileName: string) {
  // console.log("http://localhost:3000/" + fileName);
  return "http://localhost:3000/" + fileName;
}
const handleChange = (info: any) => {
  //info包含了上传文件的一些信息
  // console.log(info, "info");
  const { status } = info.file;
  if (status === "uploading") {
    loading.value = true;
  }
  if(status  == 'error'){
    loading.value = false;
  }
  if (status === "done") {
    console.log(info.file.response, "response");
    //修改pinia中avatarUrl来回显
    useAvatarInfo.$patch({ avatarUrl: info.file.response.data });
    message.success(`${info.file.name} 文件上传成功`);
  } else if (status === "error") {
    message.error(`${info.file.name} 文件上传失败`);
  }
};
</script>

<style scoped>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
