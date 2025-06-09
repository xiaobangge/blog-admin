import { http } from "@/utils/http";

interface RequestResult {
  data: any;
  code: number;
  success: boolean;
}

// 获取链接列表
export async function getLinkList(data: any) {
  return await http.request<RequestResult>("post", "/link/list", { data });
}

// 新增链接
export async function addLink(data: any) {
  return await http.request<RequestResult>("post", "/link/add", { data });
}

// 编辑链接
export async function editLink(data: any) {
  return await http.request<RequestResult>("post", "/link/update", { data });
}

// 删除链接
export async function deleteLink(id: number | number[]) {
  return await http.request<RequestResult>("post", `/link/delete`, {
    data: { id }
  });
}
