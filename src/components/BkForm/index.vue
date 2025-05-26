<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="auto"
    class="w-full"
  >
    <el-form-item
      v-for="(item, index) in columns"
      :key="index"
      :label="hideLabel ? '' : item.label"
      :prop="item.prop"
    >
      <el-input
        v-if="item.type === 'input'"
        v-model="ruleForm[item.prop]"
        :type="item.subType || 'input'"
        :placeholder="item.placeholder || item.label"
        autocomplete="off"
        :show-password="item.subType === 'password'"
      >
        <template #prefix
          ><BkSvg :iconName="item.icon" class="w-[20px] h-[20px]"
        /></template>
        <template #suffix
          ><slot :name="item.slot" :ruleFormRef="ruleFormRef" :form="ruleForm"
        /></template>
      </el-input>
      <el-input
        v-else-if="item.type === 'password'"
        v-model="ruleForm[item.prop]"
        type="password"
      />
    </el-form-item>
    <el-form-item>
      <slot name="btns" :ruleFormRef="ruleFormRef" :form="ruleForm">
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          Submit
        </el-button>
      </slot>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import BkSvg from "@/components/BkSvg/index.vue";

const props = defineProps({
  columns: {
    type: Array<any>,
    default: () => []
  },
  formData: {
    type: Object,
    default: () => ({})
  },
  rules: {
    type: Object,
    default: () => ({})
  },
  hideLabel: {
    type: Boolean,
    default: false
  }
});

const ruleFormRef = ref<FormInstance>();

const ruleForm = computed(() => props.formData);

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!");
    }
  });
};
</script>
