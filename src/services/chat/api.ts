import { request } from '@umijs/max';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatCompletionsRequest {
  messages: Message[];
  stream?: boolean;
  model?: string;
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
  return request<ChatCompletionsResponse>('/gateway/ai/api/v1/chat/completions', {
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

  try {
    while (reader) {
      const { done, value } = await reader.read();
      if (done) {
        onFinish();
        break;
      }

      const chunk = decoder.decode(value);
      const lines = chunk
        .split('\n')
        .filter(line => line.trim() !== '');

      for (const line of lines) {
        if (line.includes('[DONE]')) {
          onFinish();
          return;
        }

        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6));
            onChunk(data);
          } catch (error) {
            if (error instanceof Error) {
              onError(error);
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
