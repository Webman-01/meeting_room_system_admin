<template>
  <!-- eslint-disable vue/no-v-model-argument -->
  <a-calendar v-model:value="value">
    <template #dateCellRender="{ current }">
      <ul class="events">
        <li
          v-for="item in getListData(current)"
          :key="item.content"
          :title="item.content"
        >
          <a-badge :status="item.type" :text="item.content" />
        </li>
      </ul>
    </template>
  </a-calendar>
</template>
<script lang="ts" setup>
import { ref, useAttrs } from "vue";
import dayjs from "dayjs";
import { Dayjs } from "dayjs";

import { useBookingStore } from "@/stores/booking";
import type { ListDataType } from "@/types/booking.types";
//setup中的写法

const value = ref<Dayjs>();
const listData = useBookingStore();

const getListData = (value: Dayjs) => {
  let list: ListDataType[] = [];
  listData.result.forEach((values: ListDataType[], key: string) => {
    if (dayjs(key).format("YYYY-MM-DD") == value.format("YYYY-MM-DD")) {
      list = values;
    }
  });

  return list || [];
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
