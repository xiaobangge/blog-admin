import { http } from "@/utils/http";

export interface MessageType {
  name: any;
  id: number;
  title: string;
  content: string;
  type: number;
  heat: string;
  createTime: string;
  updateTime: string;
}

interface onceResult {
  data: MessageType;
  code: number;
  msg: string;
}
interface RequestResult {
  data: MessageType[];
  code: number;
  msg: string;
}
// 获取文章列表
export async function getMessageList(data) {
  return http.request<RequestResult>("post", "/comment/list", { data });
}

// 新增文章
export async function addMessage(data: MessageType) {
  return http.request<onceResult>("post", "/comment/add", { data });
}
// 获取文章详情
export async function getMessageOne(id: number) {
  return http.request<onceResult>("get", `/comment/detail/${id}`);
}

// 修改文章
export async function updateMessage(data: MessageType) {
  return http.request<onceResult>("post", "/comment/update", { data });
}

// 删除文章
export async function deleteMessage(id: number | number[]) {
  return http.request<onceResult>("post", `/comment/delete`, { data: { id } });
}
