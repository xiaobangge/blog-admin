export type FieldOption = {
  type:
    | "input"
    | "number"
    | "select"
    | "date"
    | "datetimerange"
    | "numberRange"
    | "switch"
    | "autocomplete"
    | "radio"
    | "checkbox"
    | "textarea"
    | "treeSelect"
    | "datetime"
    | "daterange"
    | "editor"
    | "slot";
  label?: string;
  labelWidth?: number;
  prop: string;
  placeholder?: string;
  style?: string;
  disabled?: boolean;
  options?: Array<{ label: string; value: any }> | any;
  componentProps?: Record<string, any>;
  slotName?: string;
  historyRecordId?: string;
  renderer?: () => void;
  treeData?: any;
  treeProps?: any;
  loadTreeData?: any;
  multiple?: boolean;
  valueFormat?: string;
  allowCreate?: boolean;
  display?: "block" | "none";
  defaultValue?: Date | string;
  rows?: number;
  append?: boolean;
  prepend?: boolean;
};
