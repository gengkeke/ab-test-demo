import { request } from '@umijs/max';

/** 文件上传 */
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);

  return request<Result<string>>('/gateway/ai/file/upload', {
    method: 'POST',
    data: formData,
    requestType: 'form',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

