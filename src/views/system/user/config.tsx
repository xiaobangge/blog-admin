import { reactive, ref } from "vue";
import type { FieldOption } from "@/components/CustomForm/types";
import { userManagementColumn } from "@/utils/columnData";
import { addDialog } from "@/components/ReDialog";
import CustomForm from "@/components/CustomForm/CustomForm.vue";
import dateUtils from "@/utils/dateUtils";
import {
  getUserList,
  updateUser,
  createUser,
  deleteUser,
  resetPassword
} from "@/api/user";
import { message } from "@/utils/message";
import timeUtils from "@/utils/dateUtils";
import { isAuth, UserButtonEnum } from "@/utils/buttonOermission";
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

// 搜索展示配置
export const searchFields: FieldOption[] = [
  {
    type: "input",
    label: "登录名称",
    prop: "username",
    placeholder: "登录名称",
    style: "width: 25%"
  },
  {
    type: "select",
    label: "用户状态",
    labelWidth: 85,
    prop: "state",
    placeholder: "用户状态",
    style: "width: 25%",
    options: [
      { label: "所有", value: -1 },
      { label: "正常", value: 1 },
      { label: "停用", value: 2 }
    ]
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
  username: "",
  state: -1
});

export type SortConfig = {
  sortField: string | null;
  sortOrder: "ascending" | "descending" | null;
};
export const sortConfig = reactive<SortConfig>({
  sortField: null,
  sortOrder: null
});

// 修改用户表单展示配置
export const changeFormFields = reactive<FieldOption[]>([
  {
    type: "upload",
    label: "头像",
    prop: "avatar",
    placeholder: "头像",
    style: "width: 100%"
  },
  {
    type: "input",
    label: "用户名",
    prop: "username",
    placeholder: "请输入用户名",
    style: "width: 100%"
  },
  {
    type: "input",
    label: "邮箱",
    prop: "email",
    placeholder: "请输入邮箱",
    style: "width: 100%"
  },
  {
    type: "switch",
    label: "用户状态",
    prop: "state",
    placeholder: "用户状态",
    style: "width: 100%"
  }
]);

// 修改用户表单双向绑定data
export const changeFormData = ref({
  avatar: "", // 登录账号
  username: "", // 用户名称
  password: "", // 登录密码
  state: true, // 用户状态（默认启用）
  email: ""
});

// 添加用户表单展示配置
export const addFormFields = reactive<FieldOption[]>([
  {
    type: "upload",
    label: "头像",
    prop: "avatar",
    placeholder: "头像",
    style: "width: 100%"
  },
  {
    type: "input",
    label: "用户名",
    prop: "username",
    placeholder: "请输入用户名",
    style: "width: 100%"
  },
  {
    type: "input",
    label: "登录密码",
    prop: "password",
    placeholder: "请输入登录密码",
    style: "width: 100%"
  },
  {
    type: "input",
    label: "邮箱",
    prop: "email",
    placeholder: "请输入邮箱",
    style: "width: 100%"
  },
  {
    type: "switch",
    label: "用户状态",
    prop: "state",
    placeholder: "用户状态",
    style: "width: 100%"
  }
]);

// 添加用户表单双向绑定data
export const addFormData = ref({
  avatar: "", // 登录账号
  username: "", // 用户名称
  password: "", // 登录密码
  state: true, // 用户状态（默认启用）
  email: ""
});

// reset密码展示配置
export const resetPasswordFormFields: FieldOption[] = [
  {
    type: "input",
    label: "原密码",
    prop: "password",
    placeholder: "请输入原密码",
    style: "width: 100%"
  },
  {
    type: "input",
    label: "新密码",
    prop: "newPassword",
    placeholder: "请输入新密码",
    style: "width: 100%"
  },
  {
    type: "input",
    label: "确认密码",
    prop: "confirmPassword",
    placeholder: "请输入确认密码",
    style: "width: 100%"
  }
];

// reset密码表单双向绑定data
export const resetPasswordFormData = ref({
  password: "", // 密码
  newPassword: "", // 新密码
  confirmPassword: "" // 确认密码
});

// 表单验证规则
export const formRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
  newPassword: [{ required: true, message: "请输入登录密码", trigger: "blur" }],
  confirmPassword: [
    { required: true, message: "请输入确认密码", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== resetPasswordFormData.value.newPassword) {
          callback("两次密码输入不一致!");
        } else {
          callback();
        }
      }
    }
  ],
  email: [
    { required: true, message: "请输入邮箱", trigger: "blur" },
    { type: "email", message: "邮箱格式不正确", trigger: "blur" }
  ]
};

// Table表格的系列操作

export const columns = [
  {
    type: "selection",
    align: "left",
    selectable: row => !row.is_client
  },
  ...userManagementColumn,

  {
    label: "操作",
    prop: "englishTranslation",
    align: "center",
    cellRenderer: (row: any) => {
      if (!row.row.is_client) {
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
            {isAuth(UserButtonEnum.密码) && (
              <el-button
                type="success"
                size="small"
                link
                // icon={<IconifyIconOffline icon={EditIcon} />}
                onClick={() => resetPasswordFun(row)}
              >
                重置密码
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
      } else {
        return (
          <div>
            {isAuth(UserButtonEnum.查看) && (
              <el-button
                type="primary"
                size="small"
                link
                // icon={<IconifyIconOffline icon={EditIcon} />}
                onClick={() => viewRow(row)}
              >
                查看
              </el-button>
            )}
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
    title: "修改用户",
    contentRenderer() {
      console.log(row.row);
      changeFormData.value = { ...row.row, state: row.row.state === 1 };
      return (
        <CustomForm
          type="form"
          fields={changeFormFields}
          modelValue={changeFormData}
          rules={formRules}
          onFormReady={handleFormReady}
        />
      );
    },
    beforeSure(done) {
      customFormRef.value.validate(valid => {
        console.log(valid);
        if (valid) {
          updataRowData(changeFormData, done);
        }
      });
    },
    closeCallBack() {}
  });
};
export const deleteData = async (row: any) => {
  // @ts-ignore
  await deleteUser([row.row.id]);
  loadData();
  message("删除成功", { type: "success" });
};
// 查看详情
export const viewRow = row => {
  addDialog({
    title: "查看详情",
    hideFooter: true,
    contentRenderer() {
      changeFormData.value = { ...row.row };
      return (
        <CustomForm
          type="form"
          fields={changeFormFields}
          modelValue={changeFormData}
          rules={formRules}
          disabled
        />
      );
    },
    closeCallBack() {}
  });
};

// 重置密码
export const resetPasswordFun = row => {
  addDialog({
    title: "重置密码",
    contentRenderer() {
      console.log(row.row);
      resetPasswordFormData.value = { ...row.row };
      return (
        <CustomForm
          type="form"
          fields={resetPasswordFormFields}
          modelValue={resetPasswordFormData}
          rules={formRules}
          onFormReady={handleFormReady}
        />
      );
    },
    beforeSure(done) {
      customFormRef.value.validate(async valid => {
        if (valid) {
          const res = await resetPassword({
            id: row.row.id,
            password: resetPasswordFormData.value.password,
            newPassword: resetPasswordFormData.value.newPassword
          });
          if (res.code === 200) {
            done();
            message("重置密码成功", { type: "success" });
          }
        }
      });
    },
    closeCallBack() {}
  });
};

// 请求数据
export const loadData = async () => {
  console.log(searchData, sortConfig);
  const response = await getUserList({
    username: searchData.username,
    state: searchData.state === -1 ? 0 : searchData.state,
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
  const res = await updateUser({
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
  const res = await createUser(body);
  if (res.code === 200) {
    done && done();
    customFormRef && customFormRef.value.resetFields();
    loadData();
  }
};
