<template>
  <div>
    <a-tag color="green" @click="showModal">可预定</a-tag>
    <!-- eslint-disable vue/no-v-model-argument -->
    <a-modal
      v-model:open="open"
      title="会议室预订详情"
      width="100%"
      wrap-class-name="full-modal"
      @ok="handleOk"
    >
      <Calendar v-bind="$attrs"/>
    </a-modal>
  </div>
</template>
<script lang="ts" setup>
import { useBookingStore } from "@/stores/booking";
import Calendar from "./Calendar.vue";
import { ref, useAttrs } from "vue";
const open = ref<boolean>(false);

const attrs = useAttrs();
const getBookingSituation = useBookingStore()
const showModal = () => {
  open.value = true;
  getBookingSituation.getList(attrs.meetingRoomNameFirst as string)  
};

const handleOk = (e: MouseEvent) => {
  console.log(e);
  open.value = false;
};
</script>
<style lang="scss">
.full-modal {
  .ant-modal {
    max-width: 100%;
    top: 0;
    padding-bottom: 0;
    margin: 0;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
