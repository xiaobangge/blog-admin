<template>
  <el-button
    v-if="props.hasBorder"
    :size="props.size"
    :type="props.type"
    :disabled="props.disabled"
    @click="confirmDelete"
  >
    <slot />
  </el-button>
  <el-button
    v-else
    :type="props.type"
    :disabled="props.disabled"
    size="small"
    link
    @click="confirmDelete"
  >
    <slot />
  </el-button>
</template>

<script setup>
import { ElMessageBox } from "element-plus";

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    required: false
  },
  customEvent: {
    type: Function,
    required: true
  },
  hasBorder: {
    type: Boolean,
    default: true,
    required: false
  },
  text: {
    type: String,
    default: "删除",
    required: false
  },
  text: {
    type: String,
    default: "删除",
    required: false
  }
});

const confirmDelete = () => {
  ElMessageBox.confirm(`您确定要${props.text}吗？`, "确认", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  })
    .then(async () => {
      await props.customEvent();
    })
    .catch(() => {
      console.log("操作已取消");
    });
};
</script>

<style scoped>
/* 添加样式 */
</style>
