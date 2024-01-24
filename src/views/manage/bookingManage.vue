<template>
  <div>
    <a-config-provider :locale="locale">
      <!-- 搜索栏 -->
      <div class="top">
        <a-form
          :model="searchBookingData"
          name="search"
          layout="inline"
          autocomplete="off"
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
        >
          <a-form-item label="会议室名称" name="name">
            <!-- eslint-disable vue/no-v-model-argument -->
            <a-input v-model:value="searchBookingData.meetingRoomName">
              <template #prefix>
                <HomeOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="会议室位置" name="location">
            <!-- eslint-disable vue/no-v-model-argument -->
            <a-input v-model:value="searchBookingData.meetingRoomPosition">
              <template #prefix>
                <TeamOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="预订人" name="user">
            <a-input v-model:value="searchBookingData.username">
              <template #prefix>
                <EditOutlined class="site-form-item-icon" />
              </template>
            </a-input>
          </a-form-item>

          <a-form-item label="开始时间" name="startTime">
            <a-date-picker
              placeholder="请选择"
              v-model:value="searchBookingData.rangeStartTime"
              format="YYYY-MM-DD HH:mm:ss"
              :disabled-date="disabledDate"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
            />
          </a-form-item>

          <a-form-item label="结束时间" name="endTime">
            <a-date-picker
              placeholder="请选择"
              v-model:value="searchBookingData.rangeEndTime"
              format="YYYY-MM-DD HH:mm:ss"
              :disabled-date="disabledDate"
              :show-time="{ defaultValue: dayjs('00:00:00', 'HH:mm:ss') }"
            />
          </a-form-item>
          <a-form-item class="last-item">
            <div class="else">
              <a-button type="primary">重置</a-button>
              <UpOutlined style="color: blue; margin-left: 15px" />
            </div>
          </a-form-item>
        </a-form>
      </div>
      <!-- 会议室列表 -->
      <div>
        <a-table
          :columns="columns"
          :data-source="bookingResult"
          :pagination="false"
        >
          <template v-slot:bodyCell="{ column, record }">
            <!-- 会议室名称 -->
            <template v-if="column.dataIndex === 'name'">
              <div>{{ record.room.name }}</div>
            </template>
            <!-- 会议室位置 -->
            <template v-if="column.dataIndex === 'location'">
              <div>{{ record.room.location }}</div>
            </template>
            <!-- 预订人 -->
            <template v-if="column.dataIndex === 'user'">
              <div>{{ record.user.username }}</div>
            </template>
            <!-- 审批状态 -->
            <template v-if="column.dataIndex === 'status'">
              <a-tag :color="changeColor(record.status)">{{
                record.status
              }}</a-tag>
            </template>
            <!-- 开始时间 -->
            <template v-if="column.dataIndex === 'startTime'">
              <div>{{ formatTime(record.startTime) }}</div>
            </template>
            <!-- 结束时间 -->
            <template v-if="column.dataIndex === 'endTime'">
              <div>{{ formatTime(record.endTime) }}</div>
            </template>
            <!-- 预订时间 -->
            <template v-if="column.dataIndex === 'createTime'">
              <div>{{ formatTime(record.createTime) }}</div>
              <!-- 备注 -->
              <template v-if="column.dataIndex === 'note'">
                <div>{{ record.note }}</div>
              </template>
              <!-- 描述 -->
              <template v-if="column.dataIndex === 'description'">
                <div>{{ record.room.description }}</div>
              </template>
            </template>
            <!-- 操作 -->
            <template v-else-if="column.dataIndex === 'operate'">
              <a-popconfirm
                title="确认通过吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirm(record.id, 'apply')"
                @cancel="cancel"
              >
                <a-tag color="success">通过</a-tag>
              </a-popconfirm>
              <a-popconfirm
                title="确认要驳回吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirm(record.id, 'reject')"
                @cancel="cancel"
              >
                <a-tag color="processing">驳回</a-tag>
              </a-popconfirm>
              <a-popconfirm
                title="确认解除吗?"
                ok-text="确定"
                cancel-text="取消"
                @confirm="confirm(record.id, 'unbind')"
                @cancel="cancel"
              >
                <a-tag color="error">解除</a-tag>
              </a-popconfirm>
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
    </a-config-provider>
  </div>
</template>
<script lang="ts" setup>
import moment from "moment";
import { reactive, ref, watchEffect } from "vue";
import { message } from "ant-design-vue";
import { apply, bookingList, reject, unbind } from "../../utils/interfaces";
import zhCN from "ant-design-vue/es/locale/zh_CN";
import "dayjs/locale/zh-cn";
import {
  EditOutlined,
  TeamOutlined,
  HomeOutlined,
  UpOutlined,
} from "@ant-design/icons-vue";
import dayjs, { Dayjs } from "dayjs";
import type { UserSearchResult } from "./userMange.vue";
import type { MeetingRoomSearchResult } from "./meetingRoomManage.vue";
//中文化
const locale = ref(zhCN);
dayjs.locale("zh-cn");
const disabledDate = (current: Dayjs) => {
  //禁用今天之前的日期
  return current && current < dayjs().startOf("day");
};
//当传入的status状态不同时展示不同的颜色
const changeColor = (status: string) => {
  let color;
  if (status == "审批通过") color = "green";
  else if (status == "申请中") color = "orange";
  else if (status == "审批驳回") color = "red";
  return color;
};
export interface SearchBookingData {
  username: string;
  meetingRoomName: string;
  meetingRoomPosition: string;
  rangeStartTime?: Dayjs;
  rangeEndTime?: Dayjs;
}
//搜索框数据
const searchBookingData = reactive<SearchBookingData>({
  username: "",
  meetingRoomName: "",
  meetingRoomPosition: "",
});
//用户列表相关数据
const pageNo = ref(1);
const pageSize = ref(6);
const totalCount = ref(0);
const bookingResult = ref([]);
//预订列表返回的数据
interface BookingSearchResult {
  id: number;
  startTime: string;
  endTime: string;
  status: string;
  note: string;
  createTime: string;
  updateTime: string;
  user: UserSearchResult;
  room: MeetingRoomSearchResult;
}
//调用接口获取预订列表
const getBookingList = async () => {
  const res = await bookingList(
    searchBookingData,
    pageNo.value,
    pageSize.value
  );
  const { data } = res.data;

  if (res.status == 200 || res.status == 201) {
    totalCount.value = data.totalCount;

    bookingResult.value = data.bookings.map((item: BookingSearchResult) => {
      return {
        key: item.id,
        ...item,
      };
    });
  } else {
    message.error(data || "系统繁忙，请稍后再试");
  }
};
//监视页面信息的变化
watchEffect(async () => {
  //调用接口函数获取页面信息
  getBookingList();
});

//格式化时间
function formatTime(date: Date) {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}
//操作部分弹出框
const confirm = async (id: number, status: "apply" | "reject" | "unbind") => {

  if (status == "apply") {
    const res = await apply(id);
    if (res.status == 200 || res.status == 201) {
      message.success("状态更新成功");
    } else {
      message.error(res.data.data);
    }
  } else if (status == "reject") {
    const res = await reject(id);
    if (res.status == 200 || res.status == 201) {
      message.success("状态更新成功");
    } else {
      message.error(res.data.data);
    }
  } else if (status == "unbind") {
    const res = await unbind(id);
    if (res.status == 200 || res.status == 201) {
      message.success("状态更新成功");
    } else {
      message.error(res.data.data);
    }
  }
  //操作之后再次发起请求获取最新的页面数据展示
  getBookingList();
};

const cancel = () => {
  message.warning("取消操作");
};
let columns = [
  {
    title: "会议室名称",
    dataIndex: "name",
  },
  {
    title: "会议室位置",
    dataIndex: "location",
  },
  {
    title: "预订人",
    dataIndex: "user",
  },
  {
    title: "开始时间",
    dataIndex: "startTime",
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
  },
  {
    title: "审批状态",
    dataIndex: "status",
    filters: [
      {
        text: "审批通过",
        value: "审批通过",
      },
      {
        text: "审批驳回",
        value: "审批驳回",
      },
      {
        text: "申请中",
        value: "申请中",
      },
      {
        text: "已解除",
        value: "已解除",
      },
    ],
    //筛选以传入为开头的值为字符串开头的选项
    onFilter: (value: string, record: BookingSearchResult) =>
      record.status.startsWith(value),
  },
  {
    title: "预订时间",
    dataIndex: "createTime",
  },
  {
    title: "备注",
    dataIndex: "note",
  },
  {
    title: "描述",
    dataIndex: "description",
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
  .ant-form-item {
    width: 283px;
    margin-bottom: 15px;
    margin-left: 15px;
  }
}
.last-item {
  display: flex;
  justify-content: flex-end;
  .else {
    display: flex;
    align-items: center;
  }
}
.pagination {
  margin-top: 20px;
}
.ant-modal {
  .ant-modal-body {
    .ant-form {
      margin-top: 25px;
    }
  }
}
.ant-table {
  .ant-table-content {
    .ant-table-row {
    .ant-tag{
      margin-bottom: 5px;
    }
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
