export interface OPTION {
  label: string;
  value: string;
}

// 表单项类型
export interface FormColumns {
  type: string;
  label: string;
  subType: string;
  prop: string;
  icon: string;
  options: OPTION[];
  showPassword: boolean;
  slot: string;
  placeholder: string;
}

// 表单项数据类型
export interface FormData {
  [prop: string]: any;
}

// 表单规则类型
export interface FormRules {
  [prop: string]: any;
}

// 表单类型
export interface FormType {
  columns: FormColumns[];
  data: FormData;
  rules: FormRules;
  hideLabel: boolean;
}

// 登录表单类型
export interface LoginForm extends FormType {
  username: string;
  password: string;
}

// 注册表单类型
export interface RegisterForm extends FormType {
  username: string;
  password: string;
  email: string;
  verifyCode: string;
}

// 重置密码表单类型
export interface ResetPasswordForm extends FormType {
  email: string;
  verifyCode: string;
  password: string;
}
