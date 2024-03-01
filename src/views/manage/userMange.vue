<template>
  <div>
    <!-- 搜索栏 -->
    <div class="top">
      <a-form
        :model="searchUserData"
        name="search"
        layout="inline"
        autocomplete="off"
      >
        <a-form-item label="用户名" name="username">
          <!-- eslint-disable vue/no-v-model-argument -->
          <a-input v-model:value="searchUserData.username">
            <template #prefix>
              <UserOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item label="昵称" name="nickName">
          <a-input v-model:value="searchUserData.nickName">
            <template #prefix>
              <RedditOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          label="邮箱"
          name="email"
          :rules="[{ type: 'email', message: '请输入合法的邮箱格式' }]"
        >
          <a-input v-model:value="searchUserData.email">
            <template #prefix>
              <EditOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>

        <!-- <a-form-item>
          <a-button type="primary" htmlType="submit">搜索用户</a-button>
        </a-form-item> -->
      </a-form>
    </div>
    <!-- 用户列表 -->
    <div>
      <a-table :columns="columns" :data-source="userResult" :pagination="false">
        <!-- 用户头像显示 -->
        <template v-slot:bodyCell="{ column, text, record }">
          <template v-if="column.dataIndex === 'avatar'">
            <a-image
              :src="getImageUrl(text)"
              style="width: 40px; height: 40px"
            />
          </template>
          <!-- 用户冻结操作显示 -->
          <template v-else-if="column.dataIndex === 'excute'">
            <a @click="freezeUser(record.id)" class="freeze">冻结</a>
            <a @click="thawUser(record.id)" class="freeze">解冻</a>
          </template>
          <!-- 显示用户状态 -->
          <template v-else-if="column.dataIndex === 'status'">
            <div v-if="record.isFrozen">
              <a-tag color="#2db7f5">已冻结</a-tag>
            </div>
          </template>
          <!-- 创建时间 -->
          <template v-if="column.dataIndex === 'createTime'">
            <div>{{ formatTime(record.createTime) }}</div>
          </template>
          <!-- 更新时间 -->
          <template v-if="column.dataIndex === 'updateTime'">
            <div>{{ formatTime(record.updateTime) }}</div>
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
import { onMounted, reactive, ref, watch } from "vue";
import { message } from "ant-design-vue";
import { freeze, thaw, userSearch } from "../../utils/interfaces";
import {
  UserOutlined,
  RedditOutlined,
  EditOutlined,
} from "@ant-design/icons-vue";
import moment from "moment";
import { debounce } from "@/utils/debounce_throttle/debounce";
//格式化时间
function formatTime(date: Date) {
  return moment(date).format("YYYY-MM-DD HH:mm:ss");
}
interface SearchUserData {
  username: string;
  nickName: string;
  email: string;
}
//搜索框数据
const searchUserData = reactive<SearchUserData>({
  username: "",
  nickName: "",
  email: "",
});
//用户列表相关数据
const pageNo = ref(1);
const pageSize = ref(6);
const totalCount = ref(1);
const userResult = ref([]);
//用户列表返回的数据
export interface UserSearchResult {
  id: number;
  username: string;
  nickName: string;
  email: string;
  avatar: string;
  createTime: Date;
  isFrozen: boolean;
}
//获取用户图片路径
function getImageUrl(fileName: string) {
  return "http://localhost:3000/" + fileName;
}
//发送请求获取页面数据
const getUserList = async () => {
  //调用接口函数获取页面信息
  const res = await userSearch(
    searchUserData.username,
    searchUserData.nickName,
    searchUserData.email,
    pageNo.value,
    pageSize.value
  );
  const { data } = res.data;

  if (res.status == 200 || res.status == 201) {
    totalCount.value = data.totalCount;
    userResult.value = data.users.map((item: UserSearchResult) => {
      return {
        key: item.username,
        ...item,
      };
    });
  } else {
    message.error(data || "系统繁忙，请稍后再试");
  }
};
const getData = debounce(getUserList, 300);
//监视页面信息的变化
watch([searchUserData, pageNo], () => {
  getData();
});
onMounted(() => {
  getUserList();
});

//冻结用户
async function freezeUser(id: number) {
  const res = await freeze(id);
  const { data } = res.data;

  if (res.status == 200 || res.status == 201) {
    message.success("冻结成功");
    //再次发请求渲染页面
    getUserList();
  } else {
    message.error(data || "系统繁忙,请稍后再试");
  }
}
//解冻用户
async function thawUser(id: number) {
  const res = await thaw(id);
  if (res.status == 200 || res.status == 201) {
    message.success("解冻成功");
    getUserList();
  } else {
    message.error(res.data || "系统繁忙,请稍后再试");
  }
}
let columns = [
  {
    title: "用户名",
    dataIndex: "username",
  },
  {
    title: "头像",
    dataIndex: "avatar",
  },
  {
    title: "昵称",
    dataIndex: "nickName",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "注册时间",
    dataIndex: "createTime",
  },
  {
    title: "状态",
    dataIndex: "status",
  },
  {
    title: "操作",
    dataIndex: "excute",
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
.ant-table {
  a {
    margin-left: 15px;
  }
}
</style>
