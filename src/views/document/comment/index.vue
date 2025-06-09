<template>
  <CustomTableForm
    :pagination="pagination"
    :fields="searchFields"
    :modelValue="searchData"
    :selectable="selectable"
    :tableData="tableData"
    :sortConfig="sortConfig"
    :columns="columns"
    @selectedDataEvent="selectedDataEvent"
    @loadData="loadData"
    @pageChange="pageChange"
  >
    <el-button :disabled="isAuth()" v-debounce="handleAdd" type="primary">
      新增
    </el-button>
    <CustomButton
      :disabled="isAuth() && isDisabled"
      type="success"
      :customEvent="handleDelete"
      >删除</CustomButton
    >
  </CustomTableForm>
</template>

<script setup lang="tsx">
import { ref, onMounted } from "vue";
import {
  loadData,
  searchData,
  searchFields,
  pagination,
  tableData,
  pageChange,
  sortConfig,
  columns as initialColumns
} from "./config";
import CustomTableForm from "@/components/CustomTableForm/index.vue";
import { message } from "@/utils/message";
import { deleteMoments } from "@/api/Comment";
import CustomButton from "@/components/CustomForm/CustomButton.vue";
import { isAuth } from "@/utils/buttonOermission";
import router from "@/router";
import BkSvg from "@/components/BkSvg/index.vue";

// 定义响应式状态
const selectedData = ref([]);
const isDisabled = ref(true);

const selectable = ref(true);

// 处理选中项数据
const selectedDataEvent = (data: any[]) => {
  selectedData.value = data;
  console.log(selectedData);
  isDisabled.value = data.length === 0;
};

const handleAdd = () => {
  router.push("/document/comment/create");
};

// 处理删除按钮点击事件
const handleDelete = async () => {
  if (selectedData.value.length > 0) {
    const ids = [];
    for (const item of selectedData.value) {
      ids.push(item.id);
    }
    console.log(ids);
    const res = await deleteMoments(ids);
    if (res.code === 200) {
      message("删除成功", { type: "success" });
      loadData();
    }
  } else {
    message("请先选择要删除的项", { type: "warning" });
  }
};

// 修改 columns 配置
const columns = initialColumns.map(item => {
  if (item.label === "登录名称" || item.label === "创建时间") {
    item.sortable = true;
  }
  if (item.label === "点赞数") {
    item.cellRenderer = (row: any) => {
      return (
        <div class="flex items-center justify-center">
          <BkSvg iconName="icon-dianzan" class="mr-1" />
          {row.row.like_count ?? 0}
        </div>
      );
    };
  }
  return item;
});

// 初始化数据
onMounted(() => {
  loadData();
});
</script>

<style>
.pointer {
  color: #2f95fa;
  cursor: pointer;
}
</style>
