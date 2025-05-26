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
  formRules,
  addFormFields,
  addFormData,
  pagination,
  tableData,
  addRowData,
  pageChange,
  changeFormData,
  updataRowData,
  sortConfig,
  columns as initialColumns
} from "./config";
import CustomTableForm from "@/components/CustomTableForm/index.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import CustomForm from "@/components/CustomForm/CustomForm.vue";
import { deleteUser } from "@/api/user";
import CustomSwitch from "@/components/CustomForm/CustomSwitch.vue";
import CustomButton from "@/components/CustomForm/CustomButton.vue";
import { isAuth, UserButtonEnum } from "@/utils/buttonOermission";

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

// 处理新增按钮点击事件
const customFormRef = ref(null);
const handleFormReady = formRef => {
  customFormRef.value = formRef;
};
const handleAdd = () => {
  addDialog({
    title: "添加用户",
    contentRenderer() {
      return (
        <CustomForm
          type="form"
          fields={addFormFields}
          modelValue={addFormData}
          rules={formRules}
          onFormReady={handleFormReady}
        />
      );
    },
    beforeSure(done) {
      customFormRef.value.validate(valid => {
        console.log(valid);
        if (valid) {
          addRowData(done, customFormRef);
        }
      });
    },
    closeCallBack() {}
  });
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
  if (item.label === "头像") {
    item.cellRenderer = (row: any) => {
      return (
        <div>
          {row.row.avatar ? (
            <img
              src={row.row.avatar}
              alt="头像"
              class="w-[32px] h-[32px] rounded-full"
            />
          ) : (
            <span v-else>-</span>
          )}
        </div>
      );
    };
  }
  if (item.label === "状态") {
    item.cellRenderer = (row: any) => {
      const state = ref(row.row.state === 1);
      return (
        <div>
          {isAuth(UserButtonEnum.编辑) ? (
            <CustomSwitch
              v-model={state.value}
              updataRowData={() => changeStatus(row)}
              title={item.label}
            />
          ) : (
            <span>{state.value ? "启用" : "禁用"}</span>
          )}
        </div>
      );
    };
  }
  return item;
});

const changeStatus = row => {
  const state = row.row.state !== 1;
  changeFormData.value = { ...row.row, state };
  updataRowData(changeFormData);
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
