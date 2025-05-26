import { UploadImg, UploadVideo } from "@/api/files";

export const Upload = async (file: string | Blob, type: string) => {
  const newsform = new FormData();
  newsform.append("file", file);
  const api = type === "img" ? UploadImg : UploadVideo;
  return await api(newsform);
};
