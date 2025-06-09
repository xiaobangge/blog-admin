import { http } from "@/utils/http";

interface RequestResult {
  data: any;
  code: number;
  success: boolean;
}

// 获取音乐某分类下的数据列表
export async function getMusicTypeList(type: string) {
  return await http.request<RequestResult>("post", `/music/list/${type}`);
}

// 新增链接
export async function addMusic(data: any) {
  return await http.request<RequestResult>("post", "/music/add", { data });
}

// 编辑链接
export async function editMusic(data: any) {
  return await http.request<RequestResult>("post", "/music/update", { data });
}

// 删除链接
export async function deleteMusic(id: number | number[]) {
  return await http.request<RequestResult>("post", `/music/delete`, {
    data: { id }
  });
}
