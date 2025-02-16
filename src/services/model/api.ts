import { request } from '@umijs/max';
import type { ModelRes, ModelSaveReq } from './typings';

/** 获取模型列表 */
export async function getModelList() {
  return request<Result<ModelRes[]>>('/gateway/ai/model/list', {
    method: 'GET',
  });
}

/** 保存或更新模型 */
export async function saveModel(params: ModelSaveReq) {
  return request<Result<boolean>>('/gateway/ai/model/save', {
    method: 'POST',
    data: params,
  });
}

/** 删除模型 */
export async function deleteModel(id: string) {
  return request<Result<boolean>>('/gateway/ai/model/delete', {
    method: 'POST',
    data: { id },
  });
} 