import { request } from '@umijs/max';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionsRequest {
  messages: Message[];
  stream?: boolean;
  model?: string;
  temperature?: number;
  knowledgeCodeList?: string[];
}

export interface ChatCompletionsResponse {
  choices: {
    message?: {
      content: string;
    };
    delta?: {
      content?: string;
    };
  }[];
}

export async function chatCompletions(
  params: ChatCompletionsRequest,
  signal?: AbortSignal,
) {
  if (params.stream) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    };

    // 从 localStorage 获取认证信息
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        headers['Auth'] = token;
      }
    }

    const response = await fetch('/gateway/ai/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
      signal,
    });
    return response;
  }

  return request<ChatCompletionsResponse>('/gateway/ai/v1/chat/completions', {
    method: 'POST',
    data: params,
    signal,
  });
}

export async function handleStreamResponse(
  response: Response,
  onChunk: (chunk: ChatCompletionsResponse) => void,
  onError: (error: Error) => void,
  onFinish: () => void,
) {
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  let buffer = ''; // 用于存储不完整的数据

  try {
    while (reader) {
      const { done, value } = await reader.read();
      if (done) {
        onFinish();
        break;
      }

      // 将新的数据添加到缓冲区
      buffer += decoder.decode(value, { stream: true });
      
      // 按行分割并处理每一行
      const lines = buffer.split('\n');
      // 保留最后一行（可能不完整）
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine) continue;

        if (trimmedLine === 'data: [DONE]') {
          onFinish();
          return;
        }

        if (trimmedLine.startsWith('data: ')) {
          try {
            const jsonStr = trimmedLine.slice(6);
            // 检查 JSON 字符串是否完整
            if (jsonStr && jsonStr.trim()) {
              const data = JSON.parse(jsonStr);
              onChunk(data);
            }
          } catch (error) {
            console.warn('JSON parse error:', trimmedLine);
            if (error instanceof Error) {
              // 不中断流程，只记录错误
              console.error('Parse error:', error.message);
            }
          }
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      onError(error);
    }
  } finally {
    reader?.releaseLock();
  }
}

/** ChatBot助手流式聊天接口 */
export async function chatBotCompletions(
  params: ChatCompletionsRequest,
  signal?: AbortSignal,
) {
  if (params.stream) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'text/event-stream',
    };

    // 从 localStorage 获取认证信息
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const { token } = JSON.parse(userInfo);
      if (token) {
        headers['Auth'] = token;
      }
    }

    const response = await fetch('/gateway/ai/chatbot/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
      signal,
    });
    return response;
  }

  return request<ChatCompletionsResponse>('/gateway/ai/chatbot/chat/completions', {
    method: 'POST',
    data: params,
    signal,
  });
}
