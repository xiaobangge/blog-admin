import { reactive, ref } from "vue";
import type { FieldOption } from "@/components/CustomForm/types";
import { articleManagementColumn } from "@/utils/columnData";
import dateUtils from "@/utils/dateUtils";
import {
  getArticleList,
  updateArticle,
  addArticle,
  deleteArticle,
  getArticleTypeList,
  getArticleOne
} from "@/api/Article";
import { message } from "@/utils/message";
import timeUtils from "@/utils/dateUtils";
import { isAuth, UserButtonEnum } from "@/utils/buttonOermission";
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
    label: "文章标题",
    prop: "title",
    placeholder: "文章标题",
    style: "width: 25%"
  },
  {
    type: "select",
    label: "文章类型",
    labelWidth: 85,
    prop: "type",
    placeholder: "文章类型",
    style: "width: 25%",
    options: []
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
  title: "",
  type: 0
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
    type: "input",
    label: "标题",
    prop: "title",
    placeholder: "请输入标题",
    style: "width: 100%"
  },
  {
    type: "upload",
    label: "封面",
    prop: "image_url",
    placeholder: "封面",
    upload_type: "image",
    style: "width: 100%"
  },
  {
    type: "select",
    label: "文章类型",
    prop: "type",
    placeholder: "文章类型",
    style: "width: 100%",
    options: []
  },
  {
    type: "editor",
    label: "内容",
    prop: "content",
    placeholder: "请输入内容",
    style: "width: 100%"
  }
]);

export const articleTypes = ref([]);

const loadArticleTypes = async () => {
  const response = await getArticleTypeList();
  articleTypes.value = response.data.map(item => {
    return { label: item.name, value: item.id };
  });
  addFormFields[2].options = articleTypes.value;
  searchFields[1].options = [
    { label: "全部", value: 0 },
    ...articleTypes.value
  ];
};
loadArticleTypes();

// 添加用户表单双向绑定data
export const addFormData = ref({
  title: "", // 登录账号
  content: "", // 用户名称
  type: "", // 登录密码
  state: true, // 用户状态（默认启用）
  image_url: ""
} as any);

// 表单验证规则
export const formRules = {
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
  image_url: [{ required: true, message: "请上传封面", trigger: "blur" }],
  type: [{ required: true, message: "请选择文章类型", trigger: "blur" }]
};
// Table表格的系列操作

export const columns = [
  {
    type: "selection",
    align: "left",
    selectable: row => !row.is_client
  },
  ...articleManagementColumn,

  {
    label: "操作",
    prop: "englishTranslation",
    align: "center",
    cellRenderer: (row: any) => {
      return (
        <div>
          {isAuth(UserButtonEnum.编辑) && (
            <el-button
              type="primary"
              size="small"
              link
              // icon={<IconifyIconOffline icon={EditIcon} />}
              onClick={() => editRow(row)}
            >
              编辑
            </el-button>
          )}
          {isAuth(UserButtonEnum.删除) && (
            <CustomButton
              type="danger"
              hasBorder={false}
              text={"删除"}
              disabled={false}
              customEvent={() => deleteData(row)}
            >
              {/* <IconifyIconOffline icon={DeleteIcon} /> */}
              <span style="margin-left: 2px">删除</span>
            </CustomButton>
          )}
        </div>
      );
    }
  }
];

const editRow = (row: any) => {
  router.push({
    path: "/document/article/create",
    query: { id: row.row.id }
  });
};

export const deleteData = async (row: any) => {
  // @ts-ignore
  await deleteArticle(row.row.id);
  loadData();
  message("删除成功", { type: "success" });
};
// 请求数据
export const loadData = async () => {
  console.log(searchData, sortConfig);
  const response = await getArticleList({
    title: searchData.title,
    type: searchData.type,
    // state: searchData.state === -1 ? 0 : searchData.state,
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
export const updataRowData = async (changeFormData, done?) => {
  const res = await updateArticle({
    ...changeFormData.value,
    state: changeFormData.value.state ? 1 : 2,
    type: done ? "update" : "state"
  });

  console.log(changeFormData.value);
  if (res.code === 200) {
    done && done();
    loadData();
    message("更新成功", { type: "success" });
  }
};

// 添加单条数据
export const addRowData = async (done, customFormRef) => {
  const body = {
    ...addFormData.value,
    state: addFormData.value.state ? 1 : 2
  };
  console.log(body, addFormData.value);
  // @ts-ignore
  const res = await addArticle(body);
  if (res.code === 200) {
    done?.();
    customFormRef.value?.resetFields();
    loadData();
  }
};

// 获取文章详情
export const getArticleDetail = async (id: number) => {
  const response = await getArticleOne(id);
  console.log(response.data);
  addFormData.value = response.data;
};
