<template>
  <div
    class="flex justify-center w-full h-full relative items-center animate-login-bg"
  >
    <!-- 登录表单-左侧 -->
    <div
      class="absolute flex flex-col justify-center items-center left-0 top-0 z-10 w-[50%] h-[100%] bg-[#7494ec] from-[#7494ec] to-[#91a8ff] rounded-tr-[120px] rounded-br-[120px]"
      :class="{
        'animate-login-in': type,
        'animate-login-out': !type
      }"
    >
      <div
        class="absolute h-full top-0 w-[420px] left-0 flex flex-col justify-center items-center"
        :class="{
          'animate-login-in1': type,
          'animate-login-out1': !type
        }"
      >
        <h1 class="text-white text-5xl font-bold">欢迎登录</h1>
        <span class="text-white text-lg my-[20px]">没有账号？</span>
        <span
          class="text-white text-lg cursor-pointer hover:border-none hover:bg-white hover:text-primary px-[20px] py-[2px] border-[1px] border-white rounded-[5px]"
          @click="toggleType('register')"
          >立即注册 ></span
        >
      </div>
    </div>
    <!-- 登录表单-右侧 -->
    <div
      class="w-[50%] h-[100%] absolute right-0 top-0 flex flex-col justify-center items-center py-[20px] px-[80px]"
      :class="{
        'animate-login-form-in': type
      }"
    >
      <div class="text-2xl font-bold mb-[50px] subtitle">
        Sean博客后台管理系统
      </div>
      <From
        :columns="columns"
        :formData="formData"
        :rules="rules"
        :hideLabel="true"
      >
        <template #btns="{ form, ruleFormRef }">
          <div class="flex flex-col justify-center items-center w-full">
            <div class="flex justify-between items-center w-full mb-[15px]">
              <el-checkbox v-model="remember">记住我</el-checkbox>
              <el-button type="primary" link @click="toggleType('forgetPwd')"
                >忘记密码？</el-button
              >
            </div>

            <el-button
              type="primary"
              class="w-full"
              size="small"
              @click="submit(form, ruleFormRef)"
              >登录</el-button
            >
          </div>
        </template>
      </From>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from "vue";
import From from "@/components/BkForm/index.vue";
const emit = defineEmits(["toggleType"]); // 定义事件
import { FromColumns, FormData } from "@/types/Form";
import type { FormRules, FormInstance } from "element-plus";
import { message } from "@/utils/message";
import { useRouter } from "vue-router";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";

const router = useRouter();

const remember = ref(false); // 记住我
// 表单列
const columns = reactive<FromColumns[]>([
  {
    label: "用户名",
    prop: "username",
    type: "input",
    icon: "icon-yonghuming"
  },
  {
    label: "密码",
    prop: "password",
    type: "input",
    subType: "password",
    icon: "icon-mima1"
  }
]);
// 表单数据
const formData = reactive<FormData>({
  username: "",
  password: ""
});

const rules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }]
});

const type = ref(true); // 登录注册切换

const toggleType = (str: string) => {
  type.value = false;
  setTimeout(() => {
    emit("toggleType", str); // 触发事件
    type.value = true;
  }, 800); // 切换动画延迟
};
const loading = ref(false);

const submit = (formData: FormData, formEl: FormInstance) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      loading.value = true;
      useUserStoreHook()
        .loginByUsername(formData)
        .then(res => {
          if (res.success) {
            // 获取后端路由
            return initRouter().then(() => {
              loading.value = false;
              router.push(getTopMenu(true).path).then(() => {
                message("登录成功", { type: "success" });
              });
            });
          } else {
            loading.value = false;
            message("登录失败", { type: "error" });
          }
        })
        .finally(() => (loading.value = false));
    } else {
      loading.value = false;
      console.log("error submit!");
    }
  });
};
</script>
