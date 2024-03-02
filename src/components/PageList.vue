<!-- 对列表和分页器组件的二次封装 -->
<template>
  <div>
    <a-table v-bind="$attrs" ref="tableRef">
        <!-- 这里#[value]是在动态指定插槽名，slotData是要传给对应插槽的数据 -->
        <template v-for="(key,value) in $slots" #[value]="slotData">  
             <!-- slot作为一个插槽出口来接收外部组件传来的插槽 -->
            <slot :name="value" v-bind="slotData || {}"></slot>
        </template>
    </a-table>
     <!-- eslint-disable vue/no-v-model-argument -->
    <a-pagination show-less-items v-bind="$attrs" class="pagination" ref="paginationRef"></a-pagination>
  </div>
</template>

<script setup lang="ts">
import { Pagination, Table } from 'ant-design-vue';
import { ref } from 'vue';
const tableRef = ref<InstanceType<typeof Table>>()
const paginationRef = ref<InstanceType<typeof Pagination>>()
defineExpose({
    tableRef,
    paginationRef
})

</script>

<style scoped>
.pagination {
  margin-top: 20px;
}
</style>