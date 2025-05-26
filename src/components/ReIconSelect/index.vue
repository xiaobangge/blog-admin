<template>
  <div class="icon-select-container relative" :style="{ width }">
    <el-input
      v-if="type === 'input'"
      ref="selectRef"
      v-model="selectValue"
      v-click-outside="clickOutside"
      placeholder="点击选择图标"
      readonly
    >
      <template #prepend>
        <bk-svg
          :iconName="`${selectValue}`"
          :type="activeName"
          class="w-[24px] h-[24px]"
          color="green"
        />
      </template>
    </el-input>
    <el-button v-else ref="selectRef" v-click-outside="clickOutside">
      <bk-svg
        :iconName="`${selectValue}`"
        :type="activeName"
        class="w-[24px] h-[24px]"
        color="green"
      />
      <span class="ml-4px">{{ selectValue || "点击选择图标" }}</span>
    </el-button>
    <el-popover
      ref="popoverRef"
      shadow="none"
      :virtual-ref="selectRef"
      virtual-triggering
      placement="bottom-end"
      trigger="click"
      :teleported="false"
      :width="width"
    >
      <el-tabs v-model="activeName" class="demo-tabs" @tab-change="handleClick">
        <el-tab-pane label="iconfont" name="iconfont" />
        <el-tab-pane label="element-plus" name="element" />
      </el-tabs>
      <el-input v-model="searchValue" placeholder="输入名称搜索图标" />
      <el-divider border-style="dashed" />
      <el-scrollbar :height="scrollbarHeight">
        <ul class="icon-list m-0 pl-[10px]">
          <template v-for="icon in filterIcons" :key="icon">
            <el-tooltip effect="dark" :content="icon" placement="top">
              <li
                class="icon-item p-[5px] mr-[10px] mb-[10px] cursor-pointer"
                @click="selectIcon(icon)"
              >
                <bk-svg
                  :iconName="`${activeName === 'iconfont' ? 'icon-' : ''}${icon}`"
                  :type="activeName"
                  class="w-[24px] h-[24px]"
                  color="green"
                />
              </li>
            </el-tooltip>
          </template>
        </ul>
      </el-scrollbar>
    </el-popover>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  computed,
  defineOptions,
  withDefaults,
  defineProps,
  defineEmits,
  unref,
  ComponentInternalInstance,
  getCurrentInstance
} from "vue";
import { ClickOutside as vClickOutside } from "element-plus";
import { useVModel } from "@vueuse/core";
import BkSvg from "@/components/BkSvg/index.vue";
const activeName = ref("iconfont");
defineOptions({
  name: "iconSelect"
});
const {
  appContext: {
    app: {
      config: { globalProperties }
    }
  }
} = getCurrentInstance() as ComponentInternalInstance;

const prop = withDefaults(
  defineProps<{
    modelValue: string;
    type?: "input" | "button"; // 选择元素类型
    width?: string; // 容器宽度
    scrollbarHeight?: string; // 滚动高度
  }>(),
  {
    type: "input",
    width: "100%",
    scrollbarHeight: "200px"
  }
);
const emit = defineEmits(["update:modelValue"]);

// useVModel 为 vueuse中封装的hook，强烈推荐使用vueuse
const selectValue = useVModel(prop, "modelValue", emit);
const selectRef = ref();
const searchValue = ref("");
const popoverRef = ref();

// 点击其它区域隐藏 popover 弹窗
function clickOutside() {
  unref(popoverRef).popperRef?.delayHide?.();
}
// 加载所有svg图标
const icons = ref([] as string[]);
function loadIconFonts() {
  icons.value = [];
  const svgs = import.meta.glob("@/assets/svg/*.svg");
  for (const icon in svgs) {
    const iconName = icon.split("assets/svg/")[1].split(".svg")[0];
    icons.value.push(iconName);
  }
}

const handleClick = (name: string) => {
  activeName.value = name;
  searchValue.value = "";
  console.log(name, "name");
  if (name === "iconfont") {
    loadIconFonts();
  } else {
    const { $icons } = globalProperties;
    icons.value = $icons;
  }
};
handleClick(activeName.value);
const filterIcons = computed(() => {
  console.log(icons, "sss");
  return icons.value.filter(item => item.includes(searchValue.value));
});
// 选则图标
function selectIcon(icon: string) {
  const str = activeName.value === "iconfont" ? "icon-" : "";
  selectValue.value = `${str}${icon}`;
  popoverRef.value?.hide();
  searchValue.value = "";
}
</script>

<style lang="scss" scoped>
.icon-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;

  .icon-item {
    display: flex;
    flex-direction: column;
    place-items: center center;
    border: 1px solid #ccc;

    &:hover {
      color: var(--el-color-primary);
      border-color: var(--el-color-primary);
      transform: scaleX(1.1);
      transition: all 0.2s;
    }
  }
}
</style>
