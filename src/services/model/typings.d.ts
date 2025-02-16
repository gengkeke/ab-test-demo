/** 模型类型 */
export type ModelType = 'LLM' | 'EMBEDDING' | 'STT' | 'TTS' | 'IMAGE' | 'TTI' | 'RERANKER';

/** 模型信息响应类型 */
export interface ModelRes {
  id: string;
  modelName: string;
  modelId: string;
  modelType: string;
  providerName: string;
  providerType: string;
  providerIcon?: string;
  apiBaseUrl: string;
  apiKey?: string;
  connectionStatus: number;
  status: number;
}

/** 保存模型请求参数类型 */
export interface ModelSaveReq extends Omit<ModelRes, 'id'> {
  id?: string;
} 