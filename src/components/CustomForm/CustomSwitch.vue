<template>
  <el-switch
    v-model="localChecked"
    :loading="isLoading"
    :disabled="props.disabled"
    @change="showConfirm"
  />
</template>

<script setup>
import { ref, watch } from "vue";
import { ElMessageBox } from "element-plus";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  updataRowData: {
    type: Function,
    required: false
  },
  title: {
    type: String,
    default: "切换"
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(["update:modelValue"]);
const isLoading = ref(false);

// 使用 ref 创建一个本地变量
const localChecked = ref(props.modelValue);

// 监听 prop 的变化
watch(
  () => props.modelValue,
  newValue => {
    localChecked.value = newValue;
  }
);

const showConfirm = () => {
  ElMessageBox.confirm(
    `您确定要${!props.modelValue ? "开启" : "关闭"}${props.title}吗？`,
    "确认",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    }
  )
    .then(async () => {
      // 确认后更新父组件的状态
      isLoading.value = true;
      emit("update:modelValue", localChecked.value);
      await props.updataRowData();
      isLoading.value = false;
      console.log("开关已切换");
    })
    .catch(() => {
      localChecked.value = false;
      console.log("操作已取消");
    });
};
</script>

<style scoped>
/* 添加样式 */
</style>
