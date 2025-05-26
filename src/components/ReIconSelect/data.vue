<script setup lang="ts">
import {
  ComponentInternalInstance,
  defineEmits,
  defineProps,
  getCurrentInstance,
  ref,
  computed
} from "vue";

const {
  appContext: {
    app: {
      config: { globalProperties }
    }
  }
} = getCurrentInstance() as ComponentInternalInstance;

interface Props {
  modelValue: string;
}
const props = defineProps<Props>();
const { $icons } = globalProperties;
console.log($icons, "icons");
const searchValue = ref("");
const filterIcons = computed(() =>
  $icons?.filter(icon => icon.includes(searchValue.value))
);

const emits = defineEmits(["update:modelValue"]);
</script>

<template>
  <el-popover trigger="click" :width="256" shadow="none">
    <template #reference>
      <el-button :icon="modelValue">{{ modelValue }}</el-button>
    </template>
    <el-input v-model="searchValue" placeholder="输入名称搜索图标" />
    <div class="el-icon-picker">
      <el-tooltip
        v-for="icon in filterIcons"
        :key="icon"
        class="box-item"
        effect="dark"
        :content="icon"
        placement="top-start"
      >
        <component
          :is="icon"
          :class="[icon, 'icon', { 'icon-active': icon == modelValue }]"
          @click="emits('update:modelValue', icon)"
        />
      </el-tooltip>
    </div>
  </el-popover>
</template>

<style scoped>
.el-icon-picker {
  height: 256px;
  overflow-y: scroll;
}

.icon {
  display: inline-block;
  width: 24px;
  height: 24px;
  margin: 10px;
  font-size: 20px;
  line-height: 45px;
  color: var(--el-text-color-regular);
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
}

.icon:hover {
  color: var(--el-color-primary);
}

.icon-active {
  color: var(--el-color-primary);
}
</style>
