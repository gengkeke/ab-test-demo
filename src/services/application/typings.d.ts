/** 应用信息响应类型 */
export interface ApplicationRes {
  id: string;
  appName: string;
  appDescription?: string;
  modelId: string;
  temperature?: number;
  roleSetting?: string;
  promptNoKnowledge?: string;
  historyRecords?: number;
  knowledgeBaseIds?: string[];
  promptWithKnowledge?: string;
  openingStatement?: string;
  similarityThreshold?: number;
  topReferences?: number;
  maxReferenceChars?: number;
  showKnowledgeSource?: boolean;
  createTime: string;
  updateTime: string;
}

/** 应用信息保存请求类型 */
export interface ApplicationSaveReq {
  id?: string;
  appName: string;
  appDescription?: string;
  modelId: string;
  temperature?: number;
  roleSetting?: string;
  promptNoKnowledge?: string;
  historyRecords?: number;
  knowledgeBaseIds?: string[];
  promptWithKnowledge?: string;
  openingStatement?: string;
  similarityThreshold?: number;
  topReferences?: number;
  maxReferenceChars?: number;
  showKnowledgeSource?: boolean;
}

/** ID请求类型 */
export interface IdReq {
  id: string;
}

/** API Key响应类型 */
export interface ApiKeyRes {
  id: string;
  applicationId: string;
  keyName: string;
  apiKey: string;
  status: boolean;
  createTime: string;
  updateTime: string;
}

/** API Key保存请求类型 */
export interface ApiKeySaveReq {
  id?: string;
  applicationId: number;
  keyName: string;
  apiKey?: string;
  status?: boolean;
}

/** API Key列表请求类型 */
export interface ApiKeyListReq {
  applicationId: string;
}

/** API Key状态修改请求类型 */
export interface ApiKeyStatusReq {
  id: string;
  status: boolean;
}
