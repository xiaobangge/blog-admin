import { http } from "@/utils/http";

interface RequestResult {
  data: any;
  code: number;
  success: boolean;
}

// 获取发现类型列表
export async function getFindType() {
  return await http.request<RequestResult>("post", "/find/type");
}

// 新增发现
export async function addFindType(data: any) {
  return await http.request<RequestResult>("post", "/find/type/add", { data });
}

// 编辑发现
export async function editFindType(data: any) {
  return await http.request<RequestResult>("post", "/find/type/update", {
    data
  });
}

// 删除发现
export async function deleteFindType(id: number | number[]) {
  return await http.request<RequestResult>("post", `/find/type/delete`, {
    data: { id }
  });
}

// 获取发现列表
export async function getFindList(data: any) {
  return await http.request<RequestResult>("post", "/find/list", { data });
}

// 新增发现
export async function addFind(data: any) {
  return await http.request<RequestResult>("post", "/find/add", { data });
}

// 编辑发现
export async function editFind(data: any) {
  return await http.request<RequestResult>("post", "/find/update", { data });
}

// 删除发现
export async function deleteFind(id: number | number[]) {
  return await http.request<RequestResult>("post", `/find/delete`, {
    data: { id }
  });
}
