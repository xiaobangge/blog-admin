import { http } from "@/utils/http";

interface RequestResult {
  data: any;
  returnCode: string;
  success: boolean;
}
// 上传图片
export async function UploadImg(data: FormData) {
  return http.request<RequestResult>("post", "/upload/image", { data });
}
// 上传视频
export async function UploadVideo(data: FormData) {
  return http.request<RequestResult>("post", "/upload/video", { data });
}
