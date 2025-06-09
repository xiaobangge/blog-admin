import { reactive, ref } from "vue";
import type { FieldOption } from "@/components/CustomForm/types";
import { addDialog } from "@/components/ReDialog";
import CustomForm from "@/components/CustomForm/CustomForm.vue";
import dateUtils from "@/utils/dateUtils";
import {
  editFindType,
  addFindType,
  deleteFindType,
  getFindType
} from "@/api/Find";
import { message } from "@/utils/message";
import { isAuth } from "@/utils/buttonOermission";
import CustomButton from "@/components/CustomForm/CustomButton.vue";

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

export const typeList = reactive([
  { label: "游戏", value: 1 },
  { label: "网站", value: 2 },
  { label: "相册", value: 3 }
]);

// 搜索展示配置
export const searchFields: FieldOption[] = [];

// 搜索展双向绑定data
export const searchData = reactive({
  createTime: dateUtils.getTimeRangeForLastNDays(180),
  title: ""
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
    label: "LOGO",
    prop: "image_url",
    placeholder: "LOGO",
    style: "width: 100%"
  },
  {
    type: "input",
    label: "名称",
    prop: "title",
    placeholder: "请输入名称",
    style: "width: 100%"
  }
]);

// 添加用户表单双向绑定data
export const addFormData = ref({
  id: 0,
  image_url: "", // 登录账号
  title: "" // 用户名称
});

// 表单验证规则
export const formRules = {
  image_url: [
    { required: true, message: "请输入logo在线链接", trigger: "blur" }
  ],
  title: [{ required: true, message: "请输入名称", trigger: "blur" }]
};

// Table表格的系列操作

export const columns = [
  {
    label: "ID",
    prop: "id",
    align: "center",
    width: 80
  },
  {
    label: "类型名称",
    prop: "title",
    align: "center",
    width: 120
  },
  {
    label: "LOGO",
    prop: "image_url",
    align: "center",
    cellRenderer: (row: any) => {
      return (
        <div>
          {row.row.image_url ? (
            <img
              src={row.row.image_url}
              alt="LOGO"
              class="w-[32px] h-[32px] rounded-full"
            />
          ) : (
            <span v-else>-</span>
          )}
        </div>
      );
    }
  },
  {
    label: "操作",
    prop: "englishTranslation",
    align: "center",
    cellRenderer: (row: any) => {
      return (
        <div>
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

const customFormRef = ref(null);
const handleFormReady = formRef => {
  customFormRef.value = formRef;
};

// 编辑按钮
export const editRow = row => {
  addDialog({
    title: "修改友链",
    contentRenderer() {
      console.log(row.row);
      addFormData.value = { ...row.row };
      return (
        <CustomForm
          type="form"
          fields={addFormFields}
          modelValue={addFormData}
          rules={formRules}
          onFormReady={handleFormReady}
        />
      );
    },
    beforeSure(done) {
      customFormRef.value.validate(valid => {
        console.log(valid);
        if (valid) {
          updataRowData(addFormData, done);
        }
      });
    },
    closeCallBack() {}
  });
};
export const deleteData = async (row: any) => {
  // @ts-ignore
  await deleteFindType([row.row.id]);
  loadData();
  message("删除成功", { type: "success" });
};
// 请求数据
export const loadData = async () => {
  const response = await getFindType();
  const list = response.data;
  if (list && list.length > 0) {
    tableData.value = list;
  } else {
    tableData.value = [];
    pagination.value.total = 0;
  }
};

// 更新单挑数据
export const updataRowData = async (changeFormData, done?) => {
  const res = await editFindType({
    ...changeFormData.value
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
    ...addFormData.value
  };
  // @ts-ignore
  const res = await addFindType(body);
  if (res.code === 200) {
    done && done();
    customFormRef && customFormRef.value.resetFields();
    loadData();
  }
};
