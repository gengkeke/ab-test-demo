/** 知识库信息响应类型 */
export interface KnowledgeBaseRes {
  id: string;
  knowledgeName: string;
  knowledgeDescription?: string;
  createTime: string;
}

/** 搜索结果类型 */
export interface SearchResult {
  content: string;
  id: string;
  metadata: {
    no: number;
    source: string;
  };
  score: number;
}

/** 搜索响应类型 */
export interface SearchResponse {
  status: number;
  code: string;
  message: string;
  success: boolean;
  data: SearchResult[];
}

/** 知识库片段元数据类型 */
export interface KnowledgeMetadata {
  no: number;
  source: string;
  knowledgeCode: string;
  filePath: string;
}

/** 保存知识库片段请求参数类型 */
export interface SaveKnowledgeParams {
  id: string;
  content: string;
  metadata: KnowledgeMetadata;
} 