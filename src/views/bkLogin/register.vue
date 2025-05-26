<template>
  <div
    class="w-full h-full flex justify-center items-center relative bg-white animate-login-bg"
  >
    <!-- 注册表单-右侧 -->
    <div
      class="absolute flex flex-col justify-center items-center right-0 top-0 w-[50%] h-[100%] bg-[#7494ec] from-[#91a8ff] to-[#7494ec] rounded-tl-[120px] z-10 rounded-bl-[120px]"
      :class="{
        'animate-register-in': type,
        'animate-register-out z-10': !type
      }"
    >
      <div
        class="absolute h-full top-0 w-[420px] right-0 flex flex-col justify-center items-center"
        :class="{
          'animate-register-in1': type,
          'animate-register-out1': !type
        }"
      >
        <h1 class="text-white text-5xl font-bold">注册</h1>
        <span class="text-white text-lg my-[20px]">已有账号？</span>
        <span
          class="text-white text-lg cursor-pointer hover:border-none hover:bg-white hover:text-primary px-[20px] py-[2px] border-[1px] border-white rounded-[5px]"
          @click="toggleType"
          >立即登录 ></span
        >
      </div>
    </div>
    <!-- 注册表单-左侧 -->
    <div
      class="w-[50%] h-[100%] absolute left-0 top-0 bg-white flex flex-col justify-center items-center"
      :class="{
        'animate-register-form-in': type
      }"
    >
      <div
        class="w-[80%] h-[80%] rounded-[10px] bg-white flex flex-col justify-center items-center"
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
              <el-button
                type="primary"
                class="w-full"
                @click="submit(form, ruleFormRef)"
                >注册</el-button
              >
            </div>
          </template>
          <template #code="{ ruleFormRef }">
            <el-button
              type="primary"
              class="absolute bottom-0 right-0 w-[120px]"
              :disabled="code_disabled"
              @click="getCode(ruleFormRef)"
              >{{ code_title }}</el-button
            >
          </template>
        </From>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, defineEmits } from "vue";
import From from "@/components/BkForm/index.vue";
import { FromColumns, FormData } from "@/types/Form";
import type { FormRules, FormInstance, ElNotification } from "element-plus";
import { register, sendCode } from "@/api/Login";
const emit = defineEmits(["toggleType"]); // 定义事件

const type = ref(true); // 登录注册切换

const toggleType = () => {
  type.value = false;
  setTimeout(() => {
    emit("toggleType", "login"); // 触发事件
    type.value = true;
  }, 800); // 切换动画延迟
};

// 表单列
const columns = reactive<FromColumns[]>([
  { label: "用户名", prop: "username", type: "input", icon: "icon-yonghuming" },
  { label: "邮箱", prop: "email", type: "input", icon: "icon-youxiang" },
  {
    label: "验证码",
    prop: "verifyCode",
    type: "input",
    icon: "icon-yanzhengma",
    slot: "code"
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
  email: "",
  verifyCode: "",
  password: ""
});

const rules = reactive<FormRules>({
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "请输入正确的邮箱", trigger: "blur" }
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
  verifyCode: [{ required: true, message: "请输入验证码", trigger: "blur" }]
});

const submit = (formData: FormData, formEl: FormInstance) => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (valid) {
      const res = await register(formData);
      if (res.code === 200) {
        console.log("注册成功");
        ElNotification({
          message: "注册成功，即将返回登录",
          type: "success",
          duration: 1000
        });
        setTimeout(() => {
          toggleType();
        }, 1000);
      }
    } else {
      console.log("error submit!");
    }
  });
};

const code_time = ref(60); // 验证码倒计时
const code_timer = ref(null); // 验证码定时器
const code_title = ref("获取验证码"); // 验证码按钮文字
const code_disabled = ref(false); // 验证码按钮禁用
const getCode = (formEl: FormInstance) => {
  if (code_disabled.value) return;
  if (!formEl) return;
  formEl.validateField("email", async valid => {
    if (valid) {
      const res = await sendCode({ email: formData.email, type: 0 });
      if (res.code !== 200) return;
      code_disabled.value = true;
      code_title.value = `${code_time.value}秒后重试`;
      code_timer.value = setInterval(() => {
        code_time.value--;
        if (code_time.value < 1) {
          clearInterval(code_timer.value);
          code_disabled.value = false;
          code_title.value = "获取验证码";
          code_time.value = 60;
        } else {
          code_title.value = `${code_time.value}秒后重试`;
        }
      }, 1000);
    } else {
      console.log("error submit!");
    }
  });
};
</script>
