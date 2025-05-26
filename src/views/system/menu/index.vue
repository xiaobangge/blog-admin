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
        <el-form-item label="菜单名称:">
          <el-input v-model="searchText" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单状态:">
          <el-select
            v-model="searchStatus"
            placeholder="请选择菜单状态"
            style="width: 150px"
          >
            <el-option label="显示" :value="true" />
            <el-option label="隐藏" :value="false" />
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
      <!-- 🆕 新增按钮 -->
      <el-button
        v-if="isAuth(MenuButtonEnum.添加)"
        style="margin-bottom: 15px"
        type="primary"
        @click="openDialog()"
        >新增</el-button
      >

      <!-- 📑 菜单列表（树形结构） -->
      <el-table
        :data="filteredTableData"
        row-key="id"
        border
        :default-expand-all="false"
      >
        <el-table-column prop="menu_name" label="菜单名称" />
        <el-table-column prop="menu_type" label="类型">
          <template #default="{ row }">
            <el-tag v-if="row.menu_type === 1" type="info">📂 目录</el-tag>
            <el-tag v-if="row.menu_type === 2" type="success">📄 菜单</el-tag>
            <el-tag v-if="row.menu_type === 3" type="warning">🔘 按钮</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="icon" label="菜单图标">
          <template #default="{ row }">
            <div class="flex items-center">
              <bk-svg :icon-name="row.icon" class="w-[16px] h-[16px]" />
              <span class="ml-[5px] flex-1 overflow-hidden text-nowrap">{{
                row.icon
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="菜单路径" />
        <el-table-column prop="visible" label="可见">
          <template #default="{ row }">
            <el-tag :type="row.visible ? 'success' : 'danger'">
              {{ row.visible ? "显示" : "隐藏" }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序" />
        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button
              v-if="isAuth(MenuButtonEnum.编辑)"
              type="primary"
              size="small"
              @click="openDialog(row)"
              >编辑</el-button
            >
            <CustomButton
              v-if="isAuth(MenuButtonEnum.删除)"
              size="small"
              type="danger"
              :customEvent="() => deleteMenu(row.id)"
              text="删除"
              >删除
            </CustomButton>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 📝 新增/编辑菜单弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑菜单' : '新增菜单'"
      width="1000px"
    >
      <el-form
        ref="menuForm"
        :model="newMenu"
        label-width="100px"
        :rules="formRules"
      >
        <el-form-item label="上级菜单">
          <el-tree-select
            v-model="newMenu.parent_id"
            :data="filteredTableData"
            :props="{ label: 'menu_name', value: 'id', children: 'children' }"
            placeholder="请选择上级菜单"
            check-strictly
            clearable
          />
        </el-form-item>
        <el-form-item label="菜单类型" prop="menu_type">
          <el-radio-group v-model="newMenu.menu_type">
            <el-radio :value="1">📂 目录</el-radio>
            <el-radio :value="2">📄 菜单</el-radio>
            <el-radio :value="3">🔘 按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menu_name">
          <el-input v-model="newMenu.menu_name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="菜单路径">
          <el-input v-model="newMenu.url" placeholder="请输入菜单路径" />
        </el-form-item>
        <el-form-item label="菜单图标">
          <icon-select v-model="newMenu.icon" width="520px" />
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="newMenu.sort" />
        </el-form-item>
        <el-form-item label="菜单状态">
          <el-radio-group v-model="newMenu.visible">
            <el-radio :value="1">✅ 显示</el-radio>
            <el-radio :value="0">🚫 隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMenu">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  postApiAdminMenuCreate,
  postApiAdminMenuUpdate,
  postApiAdminMenuRemove,
  getAsyncRoutes
} from "@/api/routes";
import CustomButton from "@/components/CustomForm/CustomButton.vue";
import IconSelect from "@/components/ReIconSelect/index.vue";
import { isAuth, MenuButtonEnum } from "@/utils/buttonOermission";
import BkSvg from "@/components/BkSvg/index.vue";

// 🔍 搜索相关
const searchText = ref("");
const searchStatus = ref("");

// 📑 菜单列表数据
const tableData = ref([]);

// 🛠 获取菜单数据
const fetchMenuData = async () => {
  const response = await getAsyncRoutes();
  console.log(response);
  if (response.code === 200) {
    tableData.value = sortMenuArray(response.data);
  } else {
    console.error("数据获取失败:", response.message);
  }
};

function sortMenuArray(menuArray) {
  // 排序当前层级的菜单
  menuArray.sort((a, b) => a.sort - b.sort);

  // 递归排序子菜单
  menuArray.forEach(menu => {
    if (menu.children && Array.isArray(menu.children)) {
      sortMenuArray(menu.children);
    }
  });

  return menuArray;
}

// 🛠 计算树形结构
const treeTableData = computed(() => {
  const map = new Map();
  tableData.value.forEach(item => map.set(item.id, { ...item, children: [] }));
  const tree = [];
  map.forEach(item => {
    if (item.parent_id) {
      map.get(item.parent_id)?.children.push(item);
    } else {
      tree.push(item);
    }
  });
  return tree;
});

// 📂 生成上级菜单选择器的数据
const menuTreeData = computed(() => {
  return treeTableData.value;
});

// 📝 新增/编辑弹窗
const dialogVisible = ref(false);
const isEditing = ref(false);
const newMenu = ref({
  id: null,
  menu_name: "",
  menu_type: "", // 1-菜单；2-目录；3-按钮
  sort: 0,
  parent_id: 0,
  url: "",
  icon: "",
  visible: 1
});

// 💼 表单验证规则
const formRules = {
  menu_name: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
  menu_type: [
    { required: true, message: "菜单类型不能为空", trigger: "change" }
  ],
  sort: [{ required: true, message: "排序不能为空", trigger: "blur" }]
};

// 🆕 打开弹窗
const openDialog = (menu = null) => {
  console.log(menu);

  if (menu) {
    isEditing.value = true;
    newMenu.value = {
      ...menu,
      sort: menu.sort,
      parent_id: menu.parent_id === 0 ? "" : menu.parent_id
    };
  } else {
    isEditing.value = false;
    newMenu.value = {
      id: null,
      parent_id: null,
      menu_type: "",
      menu_name: "",
      url: "",
      sort: 1,
      icon: "",
      visible: 1
    };
  }
  dialogVisible.value = true;
};

const menuForm = ref(null);
// 💾 保存菜单
const saveMenu = () => {
  const form = menuForm.value;
  form.validate(async valid => {
    if (valid) {
      if (isEditing.value) {
        const body = {
          ...newMenu.value,
          // icon: "icon",
          open_type: 1,
          parent_id: !newMenu.value.parent_id ? 0 : newMenu.value.parent_id
        };

        await postApiAdminMenuUpdate(body);
        dialogVisible.value = false;
        fetchMenuData();
      } else {
        const body = {
          ...newMenu.value,
          parent_id: !newMenu.value.parent_id ? 0 : newMenu.value.parent_id,
          // icon: "icon",
          open_type: 1,
          url: newMenu.value?.url || "#"
        };
        delete body.id;
        await postApiAdminMenuCreate(body);
        dialogVisible.value = false;
        fetchMenuData();
      }
    } else {
      console.log("表单验证失败");
      return false;
    }
  });
};

// 🗑 删除菜单
const deleteMenu = async id => {
  await postApiAdminMenuRemove({ id });
  fetchMenuData(); // 删除后刷新数据
};

// 🔄 搜索
const handleSearch = () => {
  console.log("搜索菜单:", searchText.value, "状态:", searchStatus.value);
  fetchMenuData();
};

const resetSearch = () => {
  searchText.value = "";
  searchStatus.value = "";
};

const filteredTableData = computed(() => {
  // 递归过滤数据
  const filteredData = data => {
    return data
      .filter(item => {
        // 过滤菜单名称，菜单名称符合条件的会通过
        const matchesName = item.menu_name.includes(searchText.value);

        // 过滤菜单状态（当前菜单的显示状态），只要状态符合条件，才会继续
        const matchesStatus = searchStatus.value === "" || item.visible === 1;

        // 递归过滤子菜单
        const filteredChildren = item.children
          ? filteredData(item.children)
          : [];

        // 判断当前菜单是否符合条件，如果父菜单符合条件且子菜单符合条件，则都显示
        const shouldDisplay = matchesName && matchesStatus;

        // 如果当前菜单符合条件，且有符合条件的子菜单，则保留它
        return shouldDisplay || filteredChildren.length > 0;
      })
      .map(item => ({
        ...item,
        // 递归过滤子菜单
        children: item.children ? filteredData(item.children) : []
      }));
  };

  return filteredData(tableData.value); // 对表格数据进行过滤
});

// 获取菜单数据
onMounted(() => {
  fetchMenuData();
});
</script>
