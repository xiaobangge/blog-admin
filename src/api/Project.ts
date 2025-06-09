import { http } from "@/utils/http";

interface RequestResult {
  data: any;
  code: number;
  success: boolean;
}

// 获取链接列表
export async function getProjectList(data: any) {
  return await http.request<RequestResult>("post", "/project/list", { data });
}

// 新增链接
export async function addProject(data: any) {
  return await http.request<RequestResult>("post", "/project/add", { data });
}

// 编辑链接
export async function editProject(data: any) {
  return await http.request<RequestResult>("post", "/project/update", { data });
}

// 删除链接
export async function deleteProject(id: number | number[]) {
  return await http.request<RequestResult>("post", `/project/delete`, {
    data: { id }
  });
}
