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
    <el-button
      v-if="isAuth(UserButtonEnum.添加)"
      v-debounce="handleAdd"
      type="primary"
    >
      新增
    </el-button>
    <CustomButton
      v-if="isAuth(UserButtonEnum.删除)"
      type="success"
      :disabled="isDisabled"
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
  articleTypes,
  columns as initialColumns
} from "./config";
import CustomTableForm from "@/components/CustomTableForm/index.vue";
import { message } from "@/utils/message";
import { deleteUser } from "@/api/user";
import CustomButton from "@/components/CustomForm/CustomButton.vue";
import { isAuth, UserButtonEnum } from "@/utils/buttonOermission";
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
  router.push("/document/article/create");
};

// 处理删除按钮点击事件
const handleDelete = async () => {
  if (selectedData.value.length > 0) {
    const ids = [];
    for (const item of selectedData.value) {
      ids.push(item.id);
    }
    console.log(ids);
    const res = await deleteUser(ids);
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
  if (item.label === "封面") {
    item.cellRenderer = (row: any) => {
      return (
        <div>
          {row.row.image_url ? (
            <img
              src={row.row.image_url}
              alt="封面"
              class="w-[32px] h-[32px] rounded-full"
            />
          ) : (
            <span v-else>-</span>
          )}
        </div>
      );
    };
  }
  if (item.label === "分类") {
    item.cellRenderer = (row: any) => {
      return <div>{getName(row.row)}</div>;
    };
  }
  if (item.label === "热度") {
    item.cellRenderer = (row: any) => {
      return (
        <div class="flex items-center justify-center">
          <BkSvg iconName="icon-redu" class="mr-1" />
          {row.row.heat ?? 0}
        </div>
      );
    };
  }
  return item;
});

const getName = (row: any) => {
  const info = articleTypes.value.find(
    (item: any) => item.value === Number(row.type)
  );
  return info?.label ?? "-";
};

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
