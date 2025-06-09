<template>
  <div>
    <!-- 🔍 搜索栏 -->
    <div
      style="
        display: flex;
        justify-items: center;
        padding: 18px 20px 0;
        background-color: white;
        border-radius: 0.25rem;
      "
    >
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="名称:">
          <el-input v-model="searchText" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="类型:">
          <el-select
            v-model="searchType"
            placeholder="请选择类型"
            style="width: 150px"
          >
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="handleSearch">搜索</el-button>
      <el-button @click="resetSearch">重置</el-button>
    </div>

    <div
      style="
        padding: 15px;
        margin-top: 15px;
        background-color: white;
        border-radius: 0.25rem;
      "
    >
      <!-- 📑 菜单列表（树形结构） -->
      <el-table
        :data="tableData"
        row-key="id"
        border
        :default-expand-all="false"
      >
        <el-table-column prop="id" label="ID" />
        <el-table-column prop="nickname" label="名称">
          <template #default="{ row }">
            {{ row.nickname }}
            <el-tag v-if="row.pName" type="success" class="ml-2">{{
              `@ ` + row.pName
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型">
          <template #default="{ row }">
            <el-tag type="success">{{
              typeList.find(item => item.value === row.type)?.label
            }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="头像">
          <template #default="{ row }">
            <img :src="row.avatar" class="w-[24px] h-[24px] rounded-full" />
          </template>
        </el-table-column>
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="nickname" label="内容">
          <template #default="{ row }">
            <CustomEditor v-model="row.content" readonly />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100px" align="center">
          <template #default="{ row }">
            <CustomButton
              :disabled="isAuth()"
              size="small"
              type="danger"
              link
              :customEvent="() => deleteMenu(row.id)"
              text="删除"
              >删除
            </CustomButton>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { deleteMessage, getMessageList } from "@/api/Message";
import CustomButton from "@/components/CustomForm/CustomButton.vue";
import { isAuth } from "@/utils/buttonOermission";
import CustomEditor from "@/components/CustomForm/CustomEditor.vue";
import { message } from "@/utils/message";
const typeList = [
  { label: "碎碎念", value: "comment" },
  { label: "友链", value: "link" },
  { label: "文章", value: "article" },
  { label: "留言", value: "message" }
];
// 🔍 搜索相关
const searchText = ref("");
const searchType = ref("");

// 📑 菜单列表数据
const tableData = ref([]);

// 🛠 获取菜单数据
const fetchMenuData = async () => {
  const response = await getMessageList({
    nickname: searchText.value,
    type: searchType.value
  });
  console.log(response);
  if (response.code === 200) {
    tableData.value = response.data.list;
  } else {
    console.error("数据获取失败:", response.message);
  }
};

// 🗑 删除菜单
const deleteMenu = async id => {
  await deleteMessage(id);
  message("删除成功", { type: "success" });
  fetchMenuData(); // 删除后刷新数据
};

// 🔄 搜索
const handleSearch = () => {
  fetchMenuData();
};

const resetSearch = () => {
  searchText.value = "";
  searchStatus.value = "";
  fetchMenuData();
};

// 获取菜单数据
onMounted(() => {
  fetchMenuData();
});
</script>
