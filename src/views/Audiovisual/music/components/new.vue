<template>
  <div class="bg-white rounded-lg shadow-md p-4">
    <el-carousel height="500px" motion-blur>
      <el-carousel-item v-for="item in banner" :key="item.id">
        <div class="flex justify-center items-center h-full relative">
          <img :src="item.imgurl" alt="pic" class="w-full h-full rounded-2xl" />
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getMusicTypeList } from "@/api/Music";
const banner = ref([]);
const getTypeList = async () => {
  const res = await getMusicTypeList("new");
  console.log(res);
  banner.value = res.data?.banner ?? [];
};
onMounted(() => {
  getTypeList();
});
</script>
