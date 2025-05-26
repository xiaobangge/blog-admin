import { http } from "@/utils/http";

export interface ArticleType {
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
  data: ArticleType;
  code: number;
  msg: string;
}
interface RequestResult {
  data: ArticleType[];
  code: number;
  msg: string;
}
// 获取文章类型列表
export async function getArticleTypeList() {
  return http.request<RequestResult>("get", "/article/type/list");
}

// 获取文章列表
export async function getArticleList(data) {
  return http.request<RequestResult>("post", "/article/list", { data });
}

// 新增文章
export async function addArticle(data: ArticleType) {
  return http.request<onceResult>("post", "/article/add", { data });
}
// 获取文章详情
export async function getArticleOne(id: number) {
  return http.request<onceResult>("get", `/article/detail/${id}`);
}

// 修改文章
export async function updateArticle(data: ArticleType) {
  return http.request<onceResult>("post", "/article/update", { data });
}

// 删除文章
export async function deleteArticle(id: number) {
  return http.request<onceResult>("post", `/article/delete`, { data: { id } });
}
