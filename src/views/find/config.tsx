import { reactive, ref } from "vue";
import type { FieldOption } from "@/components/CustomForm/types";
import { findManagementColumn } from "@/utils/columnData";
import { addDialog } from "@/components/ReDialog";
import CustomForm from "@/components/CustomForm/CustomForm.vue";
import dateUtils from "@/utils/dateUtils";
import { getFindList, editFind, addFind, deleteFind } from "@/api/Find";
import { message } from "@/utils/message";
import timeUtils from "@/utils/dateUtils";
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

export const typeList = reactive([]);
export const loadTypeData = (list: any[]) => {
  typeList.splice(0, typeList.length);
  const data = list.map(item => {
    return { label: item.title, value: item.id };
  });
  typeList.push(...data);
  console.log(typeList);
  addFormFields[2].options = typeList;
};

// 搜索展示配置
export const searchFields: FieldOption[] = [
  {
    type: "input",
    label: "名称",
    prop: "title",
    placeholder: "名称",
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
];

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
  },
  {
    type: "select",
    label: "类型",
    prop: "type",
    placeholder: "请选择类型",
    options: typeList,
    style: "width: 100%"
  },
  {
    type: "input",
    label: "链接",
    prop: "url",
    placeholder: "请输入链接",
    style: "width: 100%"
  },
  {
    type: "input",
    label: "描述",
    prop: "content",
    placeholder: "请输入描述",
    style: "width: 100%"
  }
]);

// 添加用户表单双向绑定data
export const addFormData = ref({
  id: 0,
  image_url: "", // 登录账号
  title: "", // 用户名称
  url: "", // 登录密码
  type: 1,
  content: "" // 用户状态（默认启用）
});

// 表单验证规则
export const formRules = {
  image_url: [{ required: true, message: "请输入logo在线链接", trigger: "blur" }],
  title: [{ required: true, message: "请输入名称", trigger: "blur" }],
  url: [{ required: true, message: "请输入链接", trigger: "blur" }],
  content: [{ required: true, message: "请输入描述", trigger: "blur" }]
};

// Table表格的系列操作

export const columns = [
  {
    type: "selection",
    align: "left",
    selectable: row => !row.is_client
  },
  ...findManagementColumn,

  {
    label: "操作",
    prop: "englishTranslation",
    align: "center",
    cellRenderer: (row: any) => {
      if (!row.row.is_client) {
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
                disabled={isAuth()}
                text={"删除"}
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
  }
];

const customFormRef = ref(null);
const handleFormReady = formRef => {
  customFormRef.value = formRef;
};

// 编辑按钮
export const editRow = row => {
  addDialog({
    title: "修改趣味发现",
    contentRenderer() {
      console.log(row.row);
      addFormData.value = { ...row.row, type: Number(row.row.type || 0) };
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
  await deleteFind([row.row.id]);
  loadData();
  message("删除成功", { type: "success" });
};
// 请求数据
export const loadData = async () => {
  console.log(searchData, sortConfig);
  const response = await getFindList({
    title: searchData.title,
    page: pagination.value.currentPage,
    page_size: pagination.value.pageSize,
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
  const res = await editFind({
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
  console.log(body, addFormData.value);
  // @ts-ignore
  const res = await addFind(body);
  if (res.code === 200) {
    done && done();
    customFormRef && customFormRef.value.resetFields();
    loadData();
  }
};
