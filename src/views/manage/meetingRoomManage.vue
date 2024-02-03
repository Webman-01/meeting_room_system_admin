<template>
  <div>
    <!-- 搜索栏 -->
    <div class="top">
      <a-form
        :model="searchMeetingRoomData"
        name="search"
        layout="inline"
        autocomplete="off"
      >
        <a-form-item label="会议室名称" name="name">
          <!-- eslint-disable vue/no-v-model-argument -->
          <a-input v-model:value="searchMeetingRoomData.name">
            <template #prefix>
              <HomeOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="可容纳人数" name="capacity">
          <!-- eslint-disable vue/no-v-model-argument -->
          <a-input v-model:value="searchMeetingRoomData.capacity">
            <template #prefix>
              <TeamOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="设备" name="equipment">
          <a-input v-model:value="searchMeetingRoomData.equipment">
            <template #prefix>
              <EditOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item>
          <!-- 创建会议室模块 -->
          <div>
            <a-button type="primary" @click="showModal">添加会议室</a-button>

            <a-modal
              keyboard
              v-model:open="createOpen"
              :title="
                typeof createMeetingRoomData.id == 'number'
                  ? '更新会议室'
                  : '添加会议室'
              "
              :confirm-loading="confirmLoading"
              @ok="handleOk"
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
        </a-form-item>
      </a-form>
    </div>
    <!-- 会议室列表 -->
    <div>
      <a-table
        :columns="columns"
        :data-source="meetingRoomResult"
        :pagination="false"
      >
        <!-- 预订状态 -->
        <template v-slot:bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'isBooked'">
            <MeetingRoomBookingModal />
          </template>
          <!-- 创建时间 -->
          <template v-if="column.dataIndex === 'createTime'">
            <div>{{ formatTime(record.createTime) }}</div>
          </template>
          <!-- 更新时间 -->
          <template v-if="column.dataIndex === 'updateTime'">
            <div>{{ formatTime(record.updateTime) }}</div>
          </template>
          <!-- 操作 -->
          <template v-else-if="column.dataIndex === 'operate'">
            <a-popconfirm
              title="你确定要删除吗"
              cancel-text="No"
              ok-text="Yes"
              @confirm="confirm(record.id)"
              @cancel="removeMeetingRoom"
            >
              <a-tag color="red">删除</a-tag>
            </a-popconfirm>
            <!-- <div > -->
            <a-tag color="blue" @click="showModal(record.id)">更新</a-tag>
            <!-- </div> -->
          </template>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination
          v-model:current="pageNo"
          :total="(totalCount / pageSize) * 10"
          show-less-items
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import moment from "moment";
import { reactive, ref, watchEffect } from "vue";
import { message } from "ant-design-vue";
import {
  deleteMeetingRoom,
  meetingRoomList,
  createMeetingRoom,
  updateMeetingRoom,
} from "../../utils/interfaces";
import {
  EditOutlined,
  TeamOutlined,
  HomeOutlined,
} from "@ant-design/icons-vue";
import MeetingRoomBookingModal from "@/components/MeetingRoomBookingModal.vue";
import Calendar from "@/components/Calendar.vue";
interface SearchMeetingRoomData {
  name: string;
  capacity: string;
  equipment: string;
}
//搜索框数据
const searchMeetingRoomData = reactive<SearchMeetingRoomData>({
  name: "",
  capacity: "",
  equipment: "",
});
//用户列表相关数据
const pageNo = ref(1);
const pageSize = ref(6);
const totalCount = ref(0);
const meetingRoomResult = ref([]);
//会议室列表返回的数据
export interface MeetingRoomSearchResult {
  id: number;
  name: string;
  capacity: string;
  location: string;
  equipment: string;
  description: string;
  isBooked: boolean;
  createTime: Date;
  updateTime: Date;
}
//调用接口获取会议室列表
const getMeetingRoomList = async () => {
  const res = await meetingRoomList(
    searchMeetingRoomData.name,
    searchMeetingRoomData.capacity,
    searchMeetingRoomData.equipment,
    pageNo.value,
    pageSize.value
  );
  const { data } = res.data;

  if (res.status == 200 || res.status == 201) {
    totalCount.value = data.totalCount;

    meetingRoomResult.value = data.meetingRooms.map(
      (item: MeetingRoomSearchResult) => {
        return {
          key: item.id,
          ...item,
        };
      }
    );
  } else {
    message.error(data || "系统繁忙，请稍后再试");
  }
};
//监视页面信息的变化
watchEffect(async () => {
  //调用接口函数获取页面信息
  getMeetingRoomList();
});
//删除会议室操作
const deleteHandler = async (id: number) => {
  try {
    await deleteMeetingRoom(id);
    //删除后再发请求刷新页面数据
    getMeetingRoomList();
  } catch (error) {
    message.error("删除失败");
  }
};
const removeMeetingRoom = () => {
  message.info("取消删除操作");
};
//点击删除弹出气泡框中的操作
const confirm = (id: number) => {
  deleteHandler(id);
  message.success("删除成功");
};

const cancel = () => {
  createMeetingRoomData.name = "";
  createMeetingRoomData.capacity = "";
  createMeetingRoomData.location = "";
  createMeetingRoomData.equipment = "";
  createMeetingRoomData.description = "";
};
const createOpen = ref<boolean>(false);
const confirmLoading = ref<boolean>(false);

//创建(更新)会议室需要的类型
interface CreateMeetingRoom {
  id?: number;
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
const onFinish = (values: any) => {
  console.log("Success:", values);
};

const onFinishFailed = (errorInfo: any) => {
  console.log("Failed:", errorInfo);
};
//点击展开modal框
const showModal = (id: number) => {
  createOpen.value = true;
  if (typeof id == "number") {
    createMeetingRoomData.id = id;
  } else {
    //如果点的是添加会议室就把id置为undefined
    createMeetingRoomData.id = undefined;
  }
};
//弹出框点击确定的回调
const handleOk = async () => {
  if (typeof createMeetingRoomData.id == "number") {
    const res = await updateMeetingRoom(createMeetingRoomData);

    if (res.status == 200 || res.status == 201) {
      getMeetingRoomList();
      message.success("更新成功");
    } else {
      message.error(res.data.data);
    }
  } else {
    const res = await createMeetingRoom(createMeetingRoomData);

    if (res.status == 200 || res.status == 201) {
      getMeetingRoomList();
      message.success("创建成功");
    } else {
      message.error(res.data.data);
    }
  }
  //清空数据，避免下次点进来还有字
  Object.assign(createMeetingRoomData, {
    name: "",
    capacity: "",
    location: "",
    equipment: "",
    description: "",
  });
  createOpen.value = false;
};
//格式化时间
function formatTime(date: Date) {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}
let columns = [
  {
    title: "名称",
    dataIndex: "name",
  },
  {
    title: "容纳人数",
    dataIndex: "capacity",
  },
  {
    title: "位置",
    dataIndex: "location",
  },
  {
    title: "设备",
    dataIndex: "equipment",
  },
  {
    title: "描述",
    dataIndex: "description",
  },
  {
    title: "添加时间",
    dataIndex: "createTime",
  },
  {
    title: "上次更新时间",
    dataIndex: "updateTime",
  },
  {
    title: "预订详情",
    dataIndex: "isBooked",
  },
  {
    title: "操作",
    dataIndex: "operate",
  },
];
</script>
<style lang="scss" scoped>
.top {
  padding-bottom: 20px;
}
.pagination {
  margin-top: 20px;
}
.ant-modal {
  .ant-modal-body {
    .ant-form {
      margin-top: 25px;
      padding-right: 50px;
    }
  }
}
.ant-table {
  .ant-table-content {
    .ant-table-row {
      .ant-tag-red {
        cursor: pointer;
      }
      .ant-tag-blue {
        cursor: pointer;
      }
    }
  }
}
</style>
