<template>
  <!-- eslint-disable vue/no-v-model-argument -->
  <a-calendar v-model:value="value">
    <template #dateCellRender="{ current }">
      <ul class="events">
        <li v-for="item in getListData(current)" :key="item.content" :title="item.content">
          <a-badge :status="item.type" :text="item.content" />
        </li>
      </ul>
    </template>
    <template #monthCellRender="{ current }">
      <div v-if="getMonthData(current)" class="notes-month">
        <section>{{ getMonthData(current) }}</section>
        <span>{{ $attrs }}</span>
      </div>
    </template>
  </a-calendar>
</template>
<script lang="ts" setup>
import { nextTick, onBeforeMount, onMounted, ref, useAttrs, watchEffect } from "vue";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";
import { getBookingByMeetingRoomName } from "@/utils/interfaces";
import { message } from "ant-design-vue";
import { useBookingStore } from "@/stores/booking";
//setup中的写法
const attrs = useAttrs();
const value = ref<Dayjs>();
const listData = useBookingStore()
const show = ref('aaa')

const getListData = (value: Dayjs) => {

  
  // getBookingSituation(attrs.meetingRoomNameFirst as string);
  // console.log(value, "000");
  // console.log(value.format('YYYY-MM-DD'),'-------');//2024-01-01
  //先转换为dayjs再用format
  // console.log(dayjs(result.value[0].date).format('YYYY-MM-DD'),'ooo');

  
  
  let list
  listData.result.forEach((values:any,key:string)=>{
    if(dayjs(key).format('YYYY-MM-DD') == value.format('YYYY-MM-DD')){
      list = values
    }
  })
  // console.log(list,'list');
  
  return list || []
  
};

const getMonthData = (value: Dayjs) => {
  if (value.month() === 8) {
    return 1394;
  }
};
</script>
<style scoped>
.events {
  list-style: none;
  margin: 0;
  padding: 0;
}
.events .ant-badge-status {
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
  text-overflow: ellipsis;
  font-size: 12px;
}
.notes-month {
  text-align: center;
  font-size: 28px;
}
.notes-month section {
  font-size: 28px;
}
</style>
