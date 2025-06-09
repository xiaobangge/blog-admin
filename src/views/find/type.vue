<template>
  <el-drawer v-model="drawer" title="类型列表" direction="rtl">
    <CustomTableForm
      :pagination="pagination"
      :fields="[]"
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
    </CustomTableForm>
    <div class="mt-[20px] flex justify-end items-center">
      <el-button @click="drawer = false">关闭</el-button>
    </div>
  </el-drawer>
</template>

<script lang="tsx" setup>
import { ref, onMounted, watch } from "vue";
import {
  loadData,
  searchData,
  formRules,
  addFormFields,
  addFormData,
  pagination,
  tableData,
  addRowData,
  pageChange,
  sortConfig,
  columns as initialColumns
} from "./type";
import CustomTableForm from "@/components/CustomTableForm/index.vue";
import { addDialog } from "@/components/ReDialog";
import CustomForm from "@/components/CustomForm/CustomForm.vue";
import CustomButton from "@/components/CustomForm/CustomButton.vue";
import { isAuth } from "@/utils/buttonOermission";
import { ElTooltip, ElDrawer } from "element-plus";
const emit = defineEmits(["change"]);
const drawer = ref(false);
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
    title: "添加类型",
    contentRenderer() {
      addFormData.value.image_url = "";
      addFormData.value.title = "";
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

// 修改 columns 配置
const columns = initialColumns.map(item => item);
const openDrawer = () => {
  drawer.value = true;
};
// 初始化数据
onMounted(() => {
  loadData();
});
watch(
  () => tableData.value,
  () => {
    emit("change", tableData.value);
  }
);
defineExpose({ openDrawer });
</script>
