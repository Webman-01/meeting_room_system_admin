<!-- <template>
  <div>
    <a-button type="primary" @click="showCreateModal">添加会议室</a-button>

    <a-modal
      keyboard
      v-model:open="createOpen"
      title="添加会议室"
      :confirm-loading="confirmLoading"
      @ok="handleCreateOk"
      @cancel="cancel"
      okText="创建"
      cancelText="取消"
    >
      <a-form
        :model="createMeetingRoomData"
        name="basic"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 18 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="会议室名称"
          name="name"
          :rules="[{ required: true, message: '请输入会议室名称' }]"
        >
          <a-input v-model:value="createMeetingRoomData.name" />
        </a-form-item>
        <a-form-item
          label="位置"
          name="location"
          :rules="[{ required: true, message: '请输入会议室位置' }]"
        >
          <a-input v-model:value="createMeetingRoomData.location" />
        </a-form-item>
        <a-form-item
          label="容纳人数"
          name="capacity"
          :rules="[{ required: true, message: '请输入可容纳人数' }]"
        >
          <a-input v-model:value="createMeetingRoomData.capacity" />
        </a-form-item>
        <a-form-item label="设备" name="equipment">
          <a-input v-model:value="createMeetingRoomData.equipment" />
        </a-form-item>
        <a-form-item label="描述" name="description">
          <a-textarea
            v-model:value="createMeetingRoomData.description"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
import { createMeetingRoom, meetingRoomList } from "@/utils/interfaces";
import { message } from "ant-design-vue";
import { inject, reactive, ref } from "vue";

//创建(更新)会议室需要的类型
interface CreateMeetingRoom {
  name: string;
  capacity: string;
  location: string;
  equipment: string;
  description: string;
}
const createMeetingRoomData = reactive<CreateMeetingRoom>({
  name: "",
  capacity: "",
  location: "",
  equipment: "",
  description: "",
});
const createOpen = ref<boolean>(false);
    const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
const showCreateModal = () => {
  createOpen.value = true;
};
const { searchMeetingRoomData, pageNo, pageSize } = inject('sharedData');
const getMeetingRoomList = inject('getMeetingRoomList');

//弹出框点击确定的回调
const handleCreateOk = async() => {
 const res = await createMeetingRoom(createMeetingRoomData)
 if(res.status ==200 || res.status==201){
    const result = await meetingRoomList(
      searchMeetingRoomData.name,
      searchMeetingRoomData.capacity,
      searchMeetingRoomData.equipment,
      pageNo.value,
      pageSize.value
    );
  message.success('创建成功')
 }else{
  message.error(res.data.data)
 }
 createOpen.value = false
};
</script>

<style></style> -->
