declare namespace CHAT {
  interface Message {
    role: 'system' | 'user' | 'assistant';
    content: string;
  }

  interface ChatCompletionRequest {
    messages: Message[];
    model?: string;
    temperature?: number;
    stream?: boolean;
    max_tokens?: number;
  }

  interface ChatCompletionResponse {
    id: string;
    object: 'chat.completion';
    created: number;
    model: string;
    choices: {
      index: number;
      message: Message;
      finish_reason: 'stop' | 'length' | 'content_filter';
    }[];
  }

  interface ChatCompletionChunk {
    id: string;
    object: 'chat.completion.chunk';
    created: number;
    model: string;
    choices: {
      index: number;
      delta: Partial<Message>;
      finish_reason: 'stop' | 'length' | 'content_filter' | null;
    }[];
  }
} 