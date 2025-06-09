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
    <el-button v-debounce="handleAdd" :disabled="isAuth()" type="primary">
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
  formRules,
  addFormFields,
  addFormData,
  pagination,
  tableData,
  addRowData,
  pageChange,
  sortConfig,
  typeList,
  columns as initialColumns
} from "./config";
import CustomTableForm from "@/components/CustomTableForm/index.vue";
import { message } from "@/utils/message";
import { addDialog } from "@/components/ReDialog";
import CustomForm from "@/components/CustomForm/CustomForm.vue";
import { deleteLink } from "@/api/Links";
import CustomButton from "@/components/CustomForm/CustomButton.vue";
import { isAuth } from "@/utils/buttonOermission";
import {ElTooltip} from "element-plus";

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
      addFormData.value.avatar = "";
      addFormData.value.name = "";
      addFormData.value.url = "";
      addFormData.value.type = 1;
      addFormData.value.remark = "";
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
    const res = await deleteLink(ids);
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
  if (item.label === "名称" || item.label === "创建时间") {
    item.sortable = true;
  }
  if (item.label === "logo") {
    item.cellRenderer = (row: any) => {
      return (
        <div>
          {row.row.avatar ? (
            <img
              src={row.row.avatar}
              alt="LOGO"
              class="w-[32px] h-[32px] rounded-full"
            />
          ) : (
            <span v-else>-</span>
          )}
        </div>
      );
    };
  }
  if (item.label === "类型") {
    item.cellRenderer = (row: any) => {
      console.log(row.row.type, typeList);  
      return (
        <div>
          {typeList.find(type => type.value === Number(row.row.type))?.label || "-"}
        </div>
      );
    };
  }
  if (item.label === "描述") {
    item.cellRenderer = (row: any) => {
      const html = `<div class="w-[200px]">${row.row.remark || "-"}</div>`
      return (
        <ElTooltip placement="bottom" content={html} raw-content>
          <div
            class="w-[200px] overflow-hidden text-ellipsis"
            style="
              display: -webkit-box; /* 将容器以弹性盒子形式布局 */
              -webkit-line-clamp: 2; /* 限制文本显示为两行 */
              -webkit-box-orient: vertical; /* 将弹性盒子的主轴方向设置为垂直方向 */
            "
          >
            {row.row.remark || "-"}
          </div>
        </ElTooltip>
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
