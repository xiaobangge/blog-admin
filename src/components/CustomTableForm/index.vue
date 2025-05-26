<template>
  <div>
    <transition name="accordion">
      <div v-show="searchShow" class="search-area">
        <CustomForm
          :labelWidth="props.labelWidth"
          type="search"
          :fields="props.fields"
          :showOpen="true"
          :modelValue="props.modelValue"
          :rules="props.rules"
          @queryData="loadData"
        />
      </div>
    </transition>
    <CustomTable
      :columns="props.columns"
      :tableData="props.tableData"
      :pagination="props.pagination"
      :sortConfig="props.sortConfig"
      :getSummaries="props.getSummaries"
      :showSummary="props.showSummary"
      :offsetBottom="offsetBottom"
      @row-click="rowClick"
      @collapseSearch="collapseSearch"
      @selectedDataEvent="selectedDataEvent"
      @loadData="loadData"
      @pageChange="pageChange"
    >
      <div>
        <slot />
      </div>
    </CustomTable>
  </div>
</template>

<script setup lang="tsx">
import { ref } from "vue";
import CustomForm from "@/components/CustomForm/CustomForm.vue";
import CustomTable from "@/components/CustomTable/index.vue";
import { FieldOption } from "../CustomForm/types";

type SortConfig = {
  sortField: string | null;
  sortOrder: "ascending" | "descending" | null;
};
const props = defineProps<{
  fields: FieldOption[];
  modelValue: any;
  columns: any[];
  tableData: any[];
  pagination: any;
  rules?: Record<string, any>;
  labelWidth?: number | string;
  sortConfig?: SortConfig;
  selectable?: any;
  getSummaries?: any;
  showSummary?: boolean;
  offsetBottom?: number | string;
}>();
const emit = defineEmits([
  "selectedDataEvent",
  "loadData",
  "pageChange",
  "rowClick"
]);

// 定义响应式状态
const isDisabled = ref(true);
const selectedData = ref([]);

// 处理选中项数据
const selectedDataEvent = (data: any[]) => {
  selectedData.value = data;
  isDisabled.value = data.length === 0;
  emit("selectedDataEvent", data);
};
const rowClick = row => {
  emit("rowClick", row);
};

// 切换搜索区域显示
const searchShow = ref(true);
const collapseSearch = () => {
  searchShow.value = !searchShow.value;
};
const pageChange = page => {
  emit("pageChange", page);
};
// 加载数据
const loadData = () => {
  emit("loadData");
};
</script>

<style>
.search-area {
  padding: 15px 15px 0;

  /* padding-bottom: 10px; */
  background-color: white;
}
</style>
