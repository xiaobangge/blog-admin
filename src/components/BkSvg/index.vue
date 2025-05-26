// src/components/SvgIcon.vue
<template>
  <svg
    v-if="iconClassName.indexOf('icon-') > -1"
    :class="svgClass"
    class="relative'"
    aria-hidden="true"
    :fill="color"
  >
    <use :xlink:href="`#${iconClassName}`" :fill="color" />
  </svg>
  <component :is="iconClassName" v-else />
</template>
<script setup lang="ts">
import { computed, watch } from "vue";
const props = defineProps({
  iconName: {
    type: String,
    required: true
  },
  className: {
    type: String,
    default: ""
  },
  color: {
    type: String,
    default: "#231815"
  },
  size: {
    type: String,
    default: "1em"
  }
});
watch(
  () => props.color,
  () => {
    console.log("color changed", props.color);
  },
  { immediate: true }
);
// 图标在 iconfont 中的名字
const iconClassName = computed(() => {
  return `${props.iconName}`;
});
// 给图标添加上类名
const svgClass = computed(() => {
  if (props.className) {
    return `w-[1em] h-[1em] ${props.className}`;
  }
  return "w-[1em] h-[1em]";
});
</script>
<style scoped>
/* .svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
} */
</style>
