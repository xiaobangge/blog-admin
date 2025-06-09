<template>
  <div
    class="w-[100vw] h-[100vh] flex justify-center items-center bg-[url('@/assets/image/aboutTime.jpg')] bg-size-[100%_100%]"
  >
    <div
      class="w-[850px] h-[500px] rounded-3xl bg-white flex relative shadow-[0_0_30px_0_rgba(0,0,0,0.2)] overflow-hidden"
    >
      <component :is="views[type]" @toggleType="toggleType" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import Login from "./login.vue";
import Register from "./register.vue";
import ForgetPwd from "./forgetPwd.vue";

const views = {
  login: Login,
  register: Register,
  forgetPwd: ForgetPwd
};

const type = ref("login"); // 登录注册切换

const toggleType = view => {
  type.value = view;
};
</script>
