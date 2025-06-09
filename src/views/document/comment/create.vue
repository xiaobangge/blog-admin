<template>
  <div>
    <el-page-header class="bg-white shadow-md p-4 rounded-xl" @back="goBack">
      <template #content>
        <span class="text-md font-600 mr-3"> {{ title }} </span>
      </template>
    </el-page-header>
    <div class="bg-white shadow-md p-4 rounded-xl mt-[20px]">
      <CustomForm
        type="form"
        :fields="addFormFields"
        :modelValue="addFormData"
        :rules="formRules"
        :onFormReady="handleFormReady"
      />
      <div class="mt-[20px] flex justify-center items-center">
        <el-button
          v-if="!route.query.id"
          type="primary"
          @click="addRowData(customFormRef)"
          >新增</el-button
        >
        <el-button v-else type="primary" @click="updataRowData(customFormRef)"
          >修改</el-button
        >
        <el-button type="default" class="ml-[10px]" @click="goBack"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
import CustomForm from "@/components/CustomForm/CustomForm.vue";
import router from "@/router";
import {
  formRules,
  addFormFields,
  addFormData,
  addRowData,
  getArticleDetail,
  updataRowData
} from "./config";
const title = ref("新增碎碎念");
import { useRoute } from "vue-router";
const route = useRoute();
// 处理新增按钮点击事件
const customFormRef = ref(null);
const handleFormReady = formRef => {
  customFormRef.value = formRef;
};
const goBack = () => {
  router.push("/document/comment/index");
};
onMounted(() => {
  addFormData.value["content"] = "";
  addFormData.value["id"] = "";
  if (route.query.id) {
    title.value = "编辑碎碎念";
    getArticleDetail(Number(route.query.id));
  }
});
</script>
