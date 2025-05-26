<template>
  <div class="w-full commentListYL">
    <MdPreview
      v-if="readonly"
      v-model="content"
      :previewTheme="previewTheme"
      style="
        font-family: inherit;
        font-size: transparent;
        background-color: transparent;
      "
      :style="{ color: textColor, 'font-size': fontSize }"
    />
    <MdEditor
      v-else
      v-model="content"
      :style="{ 'font-family': 'inherit', height: height }"
      class="w-full"
      :preview="preview"
      :placeholder="placeholder"
      :toolbars="toolbars"
      @onUploadImg="onUploadImg"
      @focus="onFocus"
      @blur="onBlur"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, defineProps, defineEmits } from "vue";
import { MdPreview, MdEditor, type ToolbarNames } from "md-editor-v3";
import "md-editor-v3/lib/preview.css";
import "md-editor-v3/lib/style.css";
import { Upload } from "@/utils/Upload";

const emit = defineEmits(["update:modelValue", "focus", "blur"]);
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  readonly: {
    type: Boolean,
    default: false
  },
  preview: {
    type: Boolean,
    default: true
  },
  placeholder: {
    type: String,
    default: "请输入内容"
  },
  height: {
    type: String,
    default: "60vh"
  },
  previewTheme: {
    type: String,
    default: "smart-blue"
  },
  textColor: {
    type: String,
    default: "black"
  },
  fontSize: {
    type: String,
    default: "16px"
  },
  toolbars: {
    type: Array<ToolbarNames>,
    default: () => [
      "bold",
      "underline",
      "italic",
      "-",
      "title",
      "strikeThrough",
      "sub",
      "sup",
      "quote",
      "unorderedList",
      "orderedList",
      "task",
      "-",
      "codeRow",
      "code",
      "link",
      "image",
      "table",
      "mermaid",
      "katex",
      "-",
      "revoke",
      "next",
      "save",
      "=",
      "pageFullscreen",
      "fullscreen",
      "preview",
      "previewOnly",
      "htmlPreview",
      "catalog"
    ]
  }
});
const content = computed({
  get: () => props.modelValue,
  set: (val: string) => {
    emit("update:modelValue", val);
  }
});
const onUploadImg = async (
  files: (string | Blob)[],
  callback: (arg0: any[]) => void
) => {
  const res = await Promise.all(
    files.map((file: string | Blob) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append("file", file);
        Upload(file, "img")
          .then((res: unknown) => rev(res))
          .catch((error: any) => rej(error));
      });
    })
  );

  // 方式一
  callback(res.map((item: any) => "/file/images/" + item.data.url));
};
const onFocus = () => {
  emit("focus");
};
const onBlur = () => {
  emit("blur");
};
</script>
