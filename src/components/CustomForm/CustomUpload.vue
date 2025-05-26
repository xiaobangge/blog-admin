<template>
  <el-upload
    class="w-[100px] h-[100px] rounded-2xl leading-[100px] text-center flex justify-center items-center bg-gray-100"
    :class="{
      'border-[1px] border-[#ddd]': !url,
      'rounded-full': type === 'avatar'
    }"
    :http-request="customUploader"
    :on-success="handleSuccess"
    :show-file-list="false"
  >
    <img v-if="url" :src="url" alt="avatar" class="w-full h-full" />
    <el-icon v-else class="avatar-uploader-icon" color="#ddd" size="30px"
      ><Plus
    /></el-icon>
  </el-upload>
</template>
<script lang="ts" setup>
import { watch, ref, defineProps, withDefaults, defineEmits } from "vue";
import { Upload } from "@/utils/Upload";

const emit = defineEmits(["update:modelValue"]);
const props = withDefaults(
  defineProps<{ modelValue: string; type?: string }>(),
  {
    modelValue: "",
    type: "avatar"
  }
);

const url = ref(props.modelValue);
watch(
  () => props.modelValue,
  value => {
    url.value = value;
  }
);
console.log(url.value);
const customUploader = async (row: any) => {
  console.log(row.file);
  console.log(row);
  const result = await Upload(row.file, "img");
  return result;
};

const handleSuccess = (res: any) => {
  console.log(res);
  url.value = "/file/images/" + res.data.url;
  emit("update:modelValue", url.value);
};
</script>
