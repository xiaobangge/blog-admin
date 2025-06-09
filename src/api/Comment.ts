import { http } from "@/utils/http";

interface RequestResult {
  data: any;
  code: number;
  success: boolean;
}

// 获取动态列表
export async function getMomentsList(data: any) {
  return await http.request<RequestResult>("post", "/moments/list", { data });
}

// 新增动态
export async function addMoments(data: any) {
  return await http.request<RequestResult>("post", "/moments/add", { data });
}

// 编辑动态
export async function editMoments(data: any) {
  return await http.request<RequestResult>("post", "/moments/update", { data });
}

// 删除动态
export async function deleteMoments(id: number | number[]) {
  return await http.request<RequestResult>("post", `/moments/delete`, {
    data: { id }
  });
}

// 获取动态详情
export async function getMomentsDetail(id: number) {
  return await http.request<RequestResult>("get", `/moments/detail/${id}`);
}

// 点赞
export async function likeMoments(data: any) {
  return await http.request<RequestResult>("post", "/moments/like", { data });
}

// 取消点赞
export async function unlikeMoments(data: any) {
  return await http.request<RequestResult>("post", "/moments/unlike", { data });
}
