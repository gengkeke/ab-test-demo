/** 模型类型 */
export type ModelType = 'LLM' | 'EMBEDDING' | 'STT' | 'TTS' | 'IMAGE' | 'TTI' | 'RERANKER';

/** 模型信息响应类型 */
export interface ModelRes {
  id: string;
  providerName: string;
  providerType: string;
  providerIcon: string;
  apiBaseUrl: string;
  status: number;
  connectionStatus: number;
  modelId: string;
  modelName: string;
  modelType: ModelType;
}

/** 保存模型请求参数类型 */
export interface ModelSaveReq {
  id?: string;
  providerName: string;
  providerType: string;
  providerIcon?: string;
  apiKey?: string;
  apiBaseUrl: string;
  status: number;
  modelId: string;
  modelName: string;
  modelType: ModelType;
} 