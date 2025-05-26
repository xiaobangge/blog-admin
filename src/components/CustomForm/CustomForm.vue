<template>
  <el-form
    ref="customFormRef"
    :model="formModel"
    :rules="formRules"
    :label-width="props.labelWidth || 100"
    class="custom-form"
  >
    <el-form-item
      v-for="field in props.fields.filter(
        (_a, index) => !showOpen || !showFiled || index < showFiled
      )"
      :key="field.prop"
      :label-width="field.labelWidth || 100"
      :label="field.label"
      :prop="field.prop"
      :style="`${field.style};display:${field.display}`"
      style="margin-bottom: 17px"
    >
      <div v-if="field.prop !== 'slot'" style="width: 100%">
        <div
          v-if="
            field.type === 'input' ||
            field.type === 'textarea' ||
            field.type === 'number'
          "
        >
          <el-input
            v-model="formModel[field.prop]"
            filterable
            :placeholder="field.placeholder"
            :type="field.type"
            :disabled="field.disabled"
            :clearable="field.clearable || true"
            :rows="field.rows || 2"
          >
            <template v-if="field.prepend" #prepend>
              <component :is="field.renderer" />
            </template>
            <template v-if="field.append" #append>
              <component :is="field.renderer" />
            </template>
          </el-input>
        </div>

        <div
          v-if="
            field.type === 'datetimerange' ||
            field.type === 'date' ||
            field.type === 'datetime' ||
            field.type === 'daterange'
          "
        >
          <el-date-picker
            v-model="formModel[field.prop]"
            style="width: 100%"
            filterable
            start-placeholder="开始时间"
            :type="field.type"
            end-placeholder="结束时间"
            :value-format="field.valueFormat"
            :clearable="field.clearable || false"
            :default-value="field.defaultValue"
          />
        </div>

        <div v-if="field.type === 'switch'">
          <el-switch v-model="formModel[field.prop]" />
        </div>

        <div v-if="field.type === 'editor'">
          <CustomEditor v-model="formModel[field.prop]" />
        </div>

        <div v-if="field.type === 'select'">
          <el-select
            v-model="formModel[field.prop]"
            :multiple="field.multiple"
            :clearable="field.clearable || false"
            :allow-create="field.allowCreate || false"
            filterable
            @change="
              data => {
                console.log(data);
                if (data[data.length - 1] === 0) {
                  formModel[field.prop] = [0];
                  return;
                }
                if (data[data.length - 1] === -1) {
                  formModel[field.prop] = [-1];
                  return;
                }
                if (data.length > 1 && data.includes(0)) {
                  formModel[field.prop] = data.filter(item => item !== 0);
                }
                if (data.length > 1 && data.includes(-1)) {
                  formModel[field.prop] = data.filter(item => item !== -1);
                }
              }
            "
          >
            <el-option
              v-for="option in field.options"
              :key="option?.label"
              :label="option?.label"
              :value="option?.value"
              :disabled="option?.disabled"
            />
          </el-select>
        </div>

        <div v-if="field.type === 'radio'">
          <el-radio-group v-model="formModel[field.prop]">
            <el-radio
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </el-radio>
          </el-radio-group>
        </div>

        <div v-if="field.type === 'checkbox'">
          <el-checkbox-group v-model="formModel[field.prop]">
            <el-checkbox
              v-for="option in field.options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
        <CustomUpload
          v-if="field.type === 'upload'"
          v-model="formModel[field.prop]"
          :type="field.upload_type"
        />
      </div>

      <!-- 处理 slot 类型 -->
      <component
        :is="field.renderer"
        v-if="field.type === 'slot'"
        v-model="formModel[field.prop]"
      />
    </el-form-item>
    <div
      v-if="props.type === 'search'"
      class="inline-flex gap-5"
      :style="{ marginLeft: getButtonMarginLeft(), marginBottom: '16px' }"
    >
      <el-button type="primary" @click="submit">{{
        submitLabel ? submitLabel : "查询"
      }}</el-button>
      <el-button type="" @click="clean">重置</el-button>

      <el-button
        v-if="fields.length > 3 && showOpen"
        type="primary"
        style="padding: 8px 0"
        @click="
          () => {
            showFiled = showFiled ? 0 : 3;
          }
        "
      >
        {{ showFiled ? "展开" : "收起" }}
        <ElIcon v-show="!showFiled">
          <ArrowUpBold />
        </ElIcon>
        <ElIcon v-show="showFiled">
          <ArrowDownBold />
        </ElIcon>
      </el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import { FieldOption } from "./types";
import { ArrowUpBold, ArrowDownBold } from "@element-plus/icons-vue";
import { ref, defineProps, onMounted, defineEmits } from "vue";
import CustomUpload from "./CustomUpload.vue";
import CustomEditor from "./CustomEditor.vue";

const props = defineProps<{
  fields: FieldOption[] | any;
  modelValue: any;
  rules?: Record<string, any>;
  labelWidth?: number | string;
  type: "search" | "form";
  queryData?: (T: any) => any;
  submitLabel?: string;
  showOpen?: boolean;
}>();
const emit = defineEmits(["form-ready", "queryData"]);

const formModel = props.modelValue;
const formRules = ref(props.rules);
const customFormRef = ref(null);
const showFiled = ref(3);

const submit = () => {
  customFormRef.value.validate(valid => {
    if (valid) {
      emit("queryData");
    }
  });
};

const clean = () => {
  customFormRef.value.resetFields();
  emit("queryData");
};

// 获取按钮左边距
const getButtonMarginLeft = () => {
  return "50px";
};

// 在组件挂载时加载选项
onMounted(() => {
  emit("form-ready", customFormRef.value);
});
</script>

<style scoped>
.custom-form {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin: 0 auto;
}

.el-form-item {
  margin-bottom: 0;
}
</style>
