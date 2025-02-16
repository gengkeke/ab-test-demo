import { request } from '@umijs/max';
import type { ApplicationRes, ApplicationSaveReq, IdReq, ApiKeyRes, ApiKeySaveReq, ApiKeyListReq, ApiKeyStatusReq } from './typings';

/** 获取应用列表 */
export async function getApplicationList() {
  return request<Result<ApplicationRes[]>>('/gateway/ai/application/list', {
    method: 'GET',
  });
}

/** 保存应用 */
export async function saveApplication(data: ApplicationSaveReq) {
  return request<Result<string>>('/gateway/ai/application/save', {
    method: 'POST',
    data,
  });
}

/** 删除应用 */
export async function deleteApplication(data: IdReq) {
  return request<Result<boolean>>('/gateway/ai/application/delete', {
    method: 'POST',
    data,
  });
}

/** 获取应用详情 */
export async function getApplicationById(data: IdReq) {
  return request<Result<ApplicationRes>>('/gateway/ai/application/detail', {
    method: 'POST',
    data,
  });
}

/** 获取API Key列表 */
export async function getApiKeyList(data: ApiKeyListReq) {
  return request<Result<ApiKeyRes[]>>('/gateway/ai/application/apiKey/list', {
    method: 'POST',
    data,
  });
}

/** 保存API Key */
export async function saveApiKey(data: ApiKeySaveReq) {
  return request<Result<boolean>>('/gateway/ai/application/apiKey/save', {
    method: 'POST',
    data,
  });
}

/** 删除API Key */
export async function deleteApiKey(data: IdReq) {
  return request<Result<boolean>>('/gateway/ai/application/apiKey/delete', {
    method: 'POST',
    data,
  });
}

/** 修改API Key状态 */
export async function modifyApiKeyStatus(data: ApiKeyStatusReq) {
  return request<Result<boolean>>('/gateway/ai/application/apiKey/modifyStatus', {
    method: 'POST',
    data,
  });
}
