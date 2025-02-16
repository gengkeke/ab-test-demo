import { request } from '@umijs/max';
import type { 
  SearchResult, 
  SearchResponse, 
  KnowledgeBaseRes, 
  SaveKnowledgeParams 
} from './typings';

/** 相似度搜索接口 */
export async function similaritySearch(
  query: string,
  knowledgeBaseCode: string,
  topK: number = 4,
) {
  return request<SearchResponse>('/gateway/ai/knowledge/similaritySearch', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {
      query: query.trim(),
      knowledgeCodeList: [knowledgeBaseCode],
      topK,
    },
  });
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

/** 保存/更新知识库片段 */
export async function saveKnowledge(params: SaveKnowledgeParams) {
  return request('/gateway/ai/knowledge/saveKnowledge', {
    method: 'POST',
    data: params,
  });
} 

/** 知识库列表 */
export async function getKnowledgeList() {
  return request<Result<KnowledgeBaseRes[]>>('/gateway/ai/knowledgeBase/list', {
    method: 'GET',
  });
}

/** 保存或更新知识库 */
export async function saveKnowledgeBase(params: Omit<KnowledgeBaseRes, 'id' | 'createTime'> & { id?: string }) {
  return request<Result<boolean>>('/gateway/ai/knowledgeBase/save', {
    method: 'POST',
    data: params,
  });
}

/** 删除知识库 */
export async function deleteKnowledgeBase(id: string) {
  return request<Result<boolean>>('/gateway/ai/knowledgeBase/delete', {
    method: 'POST',
    data: { id },
  });
}

/** 获取知识库详情 */
export async function getKnowledgeById(id: string) {
  return request<Result<KnowledgeBaseRes>>('/gateway/ai/knowledgeBase/detail', {
    method: 'POST',
    data: { id },
  });
}