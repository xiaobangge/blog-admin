<template>
  <div>
    <PureTableBar
      :columns="props.columns"
      :title="null"
      @refresh="handleRefresh"
    >
      <template #title>
        <slot />
      </template>
      <template #buttons>
        <el-tooltip content="展开/收起查询">
          <el-button link :icon="Search" @click="handleCollapseSearch" />
        </el-tooltip>
      </template>
      <template #default="{ size, dynamicColumns }">
        <PureTable
          row-key="id"
          adaptive
          :adaptiveConfig="{ offsetBottom: offsetBottom || 108 }"
          align-whole="center"
          table-layout="auto"
          :size="size"
          :columns="dynamicColumns"
          :data="props.tableData"
          :pagination="props.pagination"
          :loading="loading"
          :selectOnIndeterminate="false"
          :summary-method="getSummaries"
          :show-summary="props.showSummary"
          @selection-change="handleSelectionChange"
          @page-size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
          @sortChange="handleSortChange"
          @row-click="rowClick"
        />
      </template>
    </PureTableBar>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from "vue";
import { PureTableBar } from "@/components/RePureTableBar";
import PureTable from "@pureadmin/table";
import { Search } from "@element-plus/icons-vue";

type SortConfig = {
  sortField: string | null;
  sortOrder: "ascending" | "descending" | null;
};
// 定义组件的 props 类型
const props = defineProps<{
  columns: Array<any>;
  tableData: any;
  pagination: any;
  sortConfig?: SortConfig;
  getSummaries?: () => any;
  showSummary: boolean;
  offsetBottom?: number | string;
}>();
const sortConfig = props.sortConfig;

// 定义组件发出的事件
const emit = defineEmits([
  "collapseSearch",
  "selectedDataEvent",
  "loadData",
  "pageChange",
  "rowClick"
]);

const selectedData = ref([]);
const loading = ref(false);

// 处理选中项变化
const handleSelectionChange = data => {
  selectedData.value = data;
  emit("selectedDataEvent", selectedData.value);
};

// 处理点击行事件
const rowClick = (row, event) => {
  emit("rowClick", row);
};

// 处理排序变化
const handleSortChange = (sort: { prop: string; order: string }) => {
  sortConfig.sortField = sort.prop;
  sortConfig.sortOrder =
    sort.order === "ascending" ? "ascending" : "descending"; // 转换为后端需要的格式
  emit("loadData");
};

// 处理刷新事件
const handleRefresh = () => {
  emit("loadData");
};

// 处理展开/收起查询事件
const handleCollapseSearch = () => {
  emit("collapseSearch");
};

// 处理每页条数变化事件
const handlePageSizeChange = pageSize => {
  emit("pageChange", { pageSize });
};

// 处理当前页变化事件
const handleCurrentChange = current => {
  if (typeof current === "number") {
    emit("pageChange", { current });
  }
};
</script>

<style scoped>
/* 组件特定样式 */
.el-table__body {
  height: 600px !important;
}

.pure-table .el-table--enable-row-hover {
  height: 600px !important;
}
</style>
