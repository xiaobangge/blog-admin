import { reactive, ref } from "vue";
import type { FieldOption } from "@/components/CustomForm/types";
import { commentManagementColumn } from "@/utils/columnData";
import dateUtils from "@/utils/dateUtils";
import {
  getMomentsList,
  editMoments,
  addMoments,
  deleteMoments,
  getMomentsDetail
} from "@/api/Comment";
import { message } from "@/utils/message";
import timeUtils from "@/utils/dateUtils";
import { isAuth } from "@/utils/buttonOermission";
import CustomButton from "@/components/CustomForm/CustomButton.vue";
import router from "@/router";

export const pagination = ref({
  currentPage: 1,
  total: 0,
  pageSizes: [10, 20, 30, 50, 100],
  pageSize: 10
});
export const pageChange = page => {
  if (page.pageSize) pagination.value.pageSize = page.pageSize;
  if (page.current) pagination.value.currentPage = page.current;
  loadData();
};

export const tableData = ref([]);

// 搜索展示配置
export const searchFields: FieldOption[] = reactive([
  {
    type: "input",
    label: "关键字",
    prop: "content",
    placeholder: "关键字",
    style: "width: 25%"
  },
  {
    type: "datetimerange",
    label: "创建时间",
    labelWidth: 80,
    prop: "createTime",
    valueFormat: "YYYY-MM-DD HH:mm:ss",
    style: "width: 25%"
  }
]);

// 搜索展双向绑定data
export const searchData = reactive({
  createTime: dateUtils.getTimeRangeForLastNDays(180),
  content: ""
});

export type SortConfig = {
  sortField: string | null;
  sortOrder: "ascending" | "descending" | null;
};
export const sortConfig = reactive<SortConfig>({
  sortField: null,
  sortOrder: null
});

// 添加用户表单展示配置
export const addFormFields = reactive<FieldOption[]>([
  {
    type: "editor",
    label: "内容",
    prop: "content",
    placeholder: "请输入内容",
    style: "width: 100%"
  }
]);

export const articleTypes = ref([]);

// 添加用户表单双向绑定data
export const addFormData = ref({
  id: 0,
  content: "", // 用户名称
} as any);

// 表单验证规则
export const formRules = {
  content: [{ required: true, message: "请输入内容", trigger: "blur" }]
};
// Table表格的系列操作

export const columns = [
  {
    type: "selection",
    align: "left",
    selectable: row => !row.is_client
  },
  ...commentManagementColumn,

  {
    label: "操作",
    prop: "englishTranslation",
    align: "center",
    cellRenderer: (row: any) => {
      return (
        <div>
          {
            <el-button
              type="primary"
              size="small"
              disabled={isAuth()}
              link
              // icon={<IconifyIconOffline icon={EditIcon} />}
              onClick={() => editRow(row)}
            >
              编辑
            </el-button>
          }
          {
            <CustomButton
              type="danger"
              hasBorder={false}
              text={"删除"}
              disabled={isAuth()}
              customEvent={() => deleteData(row)}
            >
              {/* <IconifyIconOffline icon={DeleteIcon} /> */}
              <span style="margin-left: 2px">删除</span>
            </CustomButton>
          }
        </div>
      );
    }
  }
];

const editRow = (row: any) => {
  router.push({
    path: "/document/comment/create",
    query: { id: row.row.id }
  });
};

export const deleteData = async (row: any) => {
  // @ts-ignore
  await deleteMoments(row.row.id);
  loadData();
  message("删除成功", { type: "success" });
};
// 请求数据
export const loadData = async () => {
  console.log(searchData, sortConfig);
  const response = await getMomentsList({
    content: searchData.content,
    currentPage: pagination.value.currentPage,
    pageSize: pagination.value.pageSize,
    start_time: timeUtils.convertToChinaTime(searchData.createTime[0]),
    end_time: timeUtils.convertToChinaTime(searchData.createTime[1])
  });
  const list = response.data.list;
  const count = response.data.count;
  if (list && list.length > 0) {
    pagination.value.total = count;
    tableData.value = list;
  } else {
    tableData.value = [];
    pagination.value.total = 0;
  }
};

// 更新单挑数据
export const updataRowData = async (customFormRef?) => {
  const body = {
    ...addFormData.value,
    id: addFormData.value.id
  };
  // @ts-ignore
  const res = await editMoments(body);
  if (res.code === 200) {
    customFormRef.value?.resetFields();
    router.push("/document/comment/index");
  }
};

// 添加单条数据
export const addRowData = async (customFormRef?) => {
  const body = {
    ...addFormData.value
  };
  // @ts-ignore
  const res = await addMoments(body);
  if (res.code === 200) {
    customFormRef.value?.resetFields();
    router.push("/document/comment/index");
  }
};

// 获取文章详情
export const getArticleDetail = async (id: number) => {
  const response = await getMomentsDetail(id);
  console.log(response.data);
  addFormData.value["content"] = response.data["content"];
  addFormData.value["id"] = response.data["id"];
};
