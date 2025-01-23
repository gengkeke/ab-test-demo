import { request } from '@umijs/max';

/** 相似度搜索接口 */
export async function similaritySearch(
  query: string,
  knowledgeBaseCode: string,
  topK: number = 4,  // 添加 topK 参数，默认值为 4
) {
  return request('/gateway/ai/knowledge/similaritySearch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      query: query.trim(),
      knowledgeCodeList: [knowledgeBaseCode],
      topK,  // 添加 topK 参数
    },
  });
}

/** 接口返回数据类型定义 */
export interface SearchResult {
  content: string;
  id: string;
  metadata: {
    no: number;
    source: string;
  };
  score: number;
}

export interface SearchResponse {
  status: number;
  code: string;
  message: string;
  success: boolean;
  data: SearchResult[];
}

export async function getFileList(params: { 
  knowledgeCode: string;
  no?: number;
  source?: string;
}) {
  return request('/gateway/ai/knowledge/fileList', {
    method: 'POST',
    data: params,
  });
}

// 删除知识库文档
export async function deleteKnowledge(params: {
  knowledgeCode: string;
  source?: string;
  idList?: string[];
}) {
  return request('/gateway/ai/knowledge/deleteKnowledge', {
    method: 'POST',
    data: params,
  });
}

// 添加文档到知识库
export async function addContent(params: {
  file: File;
  knowledgeCode: string;
  chunkSize?: number;
}) {
  const formData = new FormData();
  formData.append('file', params.file);
  formData.append('knowledgeCode', params.knowledgeCode);
  if (params.chunkSize !== undefined && params.chunkSize !== null) {
    formData.append('chunkSize', params.chunkSize.toString());
  }

  return request('/gateway/ai/knowledge/addContent', {
    method: 'POST',
    data: formData,
  });
}

/** 知识库片段元数据类型 */
interface KnowledgeMetadata {
  no: number;
  source: string;
  knowledgeCode: string;
  filePath: string;
}

/** 保存知识库片段请求参数类型 */
interface SaveKnowledgeParams {
  id: string;
  content: string;
  metadata: KnowledgeMetadata;
}

/** 保存/更新知识库片段 */
export async function saveKnowledge(params: SaveKnowledgeParams) {
  return request('/gateway/ai/knowledge/saveKnowledge', {
    method: 'POST',
    data: params,
  });
} 