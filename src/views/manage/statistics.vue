<template>
  <div>
    <!-- 搜索栏 -->
    <div class="top">
      <a-form
        :model="statisticData"
        name="search"
        layout="inline"
        autocomplete="off"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
      >
        <!-- eslint-disable vue/no-v-model-argument -->
        <a-form-item label="开始日期" name="startTime">
          <a-date-picker
            placeholder="请选择日期"
            v-model:value="statisticData.rangeStartTime"
          />
        </a-form-item>

        <a-form-item label="结束日期" name="endTime">
          <a-date-picker
            placeholder="请选择日期"
            v-model:value="statisticData.rangeEndTime"
          />
        </a-form-item>
        <a-form-item class="last-item" label="图表类型">
          <a-select
            v-model:value="type"
            label-in-value
            style="width: 150px"
            :options="options"
            @change="handleChange"
          ></a-select>
        </a-form-item>
      </a-form>
    </div>
    <!-- 图表 -->
    <div class="chart">
      <!-- 用户图表 -->
      <div id="chartUser">用户预订图表</div>
      <!-- 会议室图表 -->
      <div id="chartMeetingRoom">会议室预订图表</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { message, type SelectProps } from "ant-design-vue";
import { reactive, ref, watchEffect } from "vue";
import dayjs from "dayjs";
import * as echarts from "echarts";
import { meetingRoomUsedCount, userBookingCount } from "../../utils/interfaces";
//图表选项框的选项
const options = ref<SelectProps["options"]>([
  {
    value: "pie",
    label: "饼图",
  },
  {
    value: "bar",
    label: "柱状图",
  },
]);
const type = ref({ value: "bar", label: "柱状图" });
const handleChange: SelectProps["onChange"] = (type: any) => {
  if (type.key == "bar") {
    statisticData.echartsType == "bar";
  } else if (type == "pie") {
    statisticData.echartsType == "pie";
  }
};
interface SearchStatisticData {
  echartsType: string;
  rangeStartTime?: string;
  rangeEndTime?: string;
}
//搜索框数据
const statisticData = reactive<SearchStatisticData>({
  echartsType: "",
});
//用户预订数据数组
const userBookingResult = ref([]);
//会议室预订情况数组
const meetingRoomBookingResult = ref([]);
//获取用于渲染图表的数据
const getStatisticData = async (
  start: string | undefined,
  end: string | undefined
) => {
  const startTime = dayjs(start).format("YYYY-MM-DD");
  const endTime = dayjs(end).format("YYYY-MM-DD");
  //如果没输入日期不发请求
  if (
    statisticData.rangeStartTime == null ||
    statisticData.rangeEndTime == null
  )
    return;
  //结束时间<开始时间不发请求
  if (statisticData.rangeStartTime > statisticData.rangeEndTime) {
    message.error("开始时间不能晚于结束时间");
    return;
  }
  const resUser = await userBookingCount(startTime, endTime);
  const { data } = resUser.data;
  if (resUser.status == 200 || resUser.status == 201) {
    userBookingResult.value = data;
    initEchartUser();
  }
  const resMeetingRoom = await meetingRoomUsedCount(startTime, endTime);
  if (resMeetingRoom.status == 200 || resMeetingRoom.status == 201) {
    meetingRoomBookingResult.value = resMeetingRoom.data.data;
    initEchartMeetingRoom();
  }
};
//监视数据变化
watchEffect(() => {
  //传入时间变化时更新图表
  getStatisticData(statisticData.rangeStartTime, statisticData.rangeEndTime);
  //图表类型筛选变换时更新图表
  type.value;
});
//初始化用户柱图表
const initEchartUser = () => {
  const chartElement = document.getElementById("chartUser") as HTMLElement;
  if (chartElement == null) {
    return;
  }
  //在新建新的图表之前先销毁旧的，防止出现报错
  echarts.dispose(chartElement);
  const myChart = echarts.init(chartElement);
  myChart.setOption({
    title: {
      text: "用户预订情况",
      left: "center",
      top: "20px",
    },
    tooltip: {},
    xAxis: {
      //不为空就调用方法
      data: userBookingResult.value?.map((item: any) => item.username),
    },
    yAxis: {},
    series: [
      {
        name: "预订次数",
        barWidth: 20,
        type: type.value.value,
        data: userBookingResult.value?.map((item: any) => {
          return {
            name: item.username,
            value: item.bookingCount,
          };
        }),
      },
    ],
  });
};
//初始化会议室图表
const initEchartMeetingRoom = () => {
  const chartElement = document.getElementById(
    "chartMeetingRoom"
  ) as HTMLElement;
  if (chartElement == null) {
    return;
  }
  echarts.dispose(chartElement);
  const myChart = echarts.init(chartElement);
  myChart.setOption({
    title: {
      text: "会议室使用情况",
      left: "center",
      top: "20px",
    },
    tooltip: {},
    xAxis: {
      //不为空就调用方法
      data: meetingRoomBookingResult.value?.map(
        (item: any) => item.meetingRoomName
      ),
    },
    yAxis: {},
    series: [
      {
        name: "使用次数",
        type: type.value.value,
        barWidth: 20,
        data: meetingRoomBookingResult.value?.map((item: any) => {
          return {
            name: item.meetingRoomName,
            value: item.usedCount,
          };
        }),
      },
    ],
  });
};
</script>

<style scoped lang="scss">
.chart {
  display: flex;
  text-align: center;
  justify-content: space-between;
  color: gray;
  #chartUser {
    width: 100%;
    height: 450px;
    margin-right: 50px;
  }
  #chartMeetingRoom {
    width: 100%;
    height: 450px;
  }
}
.top {
  margin-bottom: 20px;
}
</style>
