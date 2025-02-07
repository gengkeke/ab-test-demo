import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Input, Button, Avatar, Select, message } from 'antd';
import { SearchOutlined, SendOutlined, UserOutlined, RobotOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import styles from './index.less';
import { Message, chatBotCompletions, handleStreamResponse, type ChatCompletionsResponse, getModels, type ModelOption } from '@/services/chat/api';

// 自定义代码块渲染
const CodeBlock = ({language, value}: { language: string; value: string }) => (
  <SyntaxHighlighter language={language} style={vscDarkPlus}>
    {value}
  </SyntaxHighlighter>
);

// 自定义 sanitize schema
const schema = {
  ...defaultSchema,
  tagNames: [
    ...(defaultSchema.tagNames || []),
    'think'
  ],
  attributes: {
    ...defaultSchema.attributes,
    think: []
  }
};

// 自定义处理器来处理 HTML 内容
const customComponents = {
  code({inline, className, children, ...props}: {
    inline?: boolean;
    className?: string;
    children: React.ReactNode;
  }) {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <CodeBlock
        language={match[1]}
        value={String(children).replace(/\n$/, '')}
      />
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  table({children}: { children: React.ReactNode }) {
    return (
      <div className={styles.tableWrapper}>
        <table>{children}</table>
      </div>
    );
  },
};

const HainaBot: React.FC = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const abortController = useRef<AbortController | null>(null);
  
  // 使用 useRef 来存储当前的流式内容
  const streamContentRef = useRef('');
  const displayContentRef = useRef('');
  const pendingContentRef = useRef('');
  const animationFrameRef = useRef<number>();

  // 获取模型列表
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await getModels();
        if (response.success && response.data) {
          setModels(response.data);
          // 如果有模型数据，设置第一个为默认值
          if (response.data.length > 0) {
            setCurrentModel(response.data[0].modelValue);
          }
        }
      } catch (error) {
        console.error('获取模型列表失败:', error);
        message.error('获取模型列表失败');
      }
    };
    fetchModels();
  }, []);

  // 创建打字机效果的更新函数
  const updateWithTypingEffect = useCallback((currentMessages: Message[], newContent: string) => {
    if (pendingContentRef.current !== newContent) {
      pendingContentRef.current = newContent;
      if (!animationFrameRef.current) {
        const animate = () => {
          if (displayContentRef.current.length < pendingContentRef.current.length) {
            // 每次添加一个字符
            displayContentRef.current = pendingContentRef.current.slice(0, displayContentRef.current.length + 1);
            
            setMessages(prev => prev.map((msg, index) => 
              index === prev.length - 1 ? { ...msg, content: displayContentRef.current } : msg
            ));
            
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            animationFrameRef.current = undefined;
          }
        };
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    }
  }, []);

  // 发送消息
  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;
    setIsLoading(true);
    setSearchValue('');

    // 添加用户消息
    const userMessage: Message = {
      role: 'user',
      content: content.trim(),
    };
    setMessages(prev => [...prev, userMessage]);

    // 创建一个空的机器人消息
    const botMessage: Message = {
      role: 'assistant',
      content: '',
    };
    setMessages(prev => [...prev, botMessage]);

    try {
      // 如果有正在进行的请求，取消它
      if (abortController.current) {
        abortController.current.abort();
      }

      // 取消当前的动画
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = undefined;
      }

      abortController.current = new AbortController();
      
      // 重置所有内容引用
      streamContentRef.current = '';
      displayContentRef.current = '';
      pendingContentRef.current = '';

      const response = await chatBotCompletions(
        {
          messages: [userMessage],
          stream: true,
          model: currentModel,
        },
        abortController.current.signal
      );

      if (response instanceof Response && response.ok) {
        await handleStreamResponse(
          response,
          (chunk: ChatCompletionsResponse) => {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              streamContentRef.current += content;
              // 使用打字机效果更新内容
              updateWithTypingEffect([userMessage], streamContentRef.current);
            }
          },
          (error: Error) => {
            console.error('Stream error:', error);
            setMessages(prev => prev.map((msg, index) => 
              index === prev.length - 1 ? { ...msg, content: '抱歉，发生了一些错误，请稍后重试。' } : msg
            ));
          },
          () => {
            // 流式响应结束时，确保显示完整内容
            setMessages(prev => prev.map((msg, index) => 
              index === prev.length - 1 ? { ...msg, content: streamContentRef.current } : msg
            ));
            setIsLoading(false);
            abortController.current = null;
          }
        );
      } else {
        throw new Error('Response not ok');
      }
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
      abortController.current = null;
      
      // 更新错误消息
      setMessages(prev => prev.map((msg, index) => 
        index === prev.length - 1 ? { ...msg, content: '抱歉，发生了一些错误，请稍后重试。' } : msg
      ));
    }
  };

  // 在组件卸载时清理
  React.useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <img src="/HainaBot.png" alt="HinaBot Logo" className={styles.logo} />
        
        <div className={styles.messageList}>
          {messages.map((msg, index) => (
            <div key={index} className={`${styles.messageItem} ${msg.role === 'user' ? styles.user : ''}`}>
              <div className={styles.messageRow}>
                <Avatar
                  className={styles.avatar}
                  icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                  style={{
                    background: '#9580f7',
                  }}
                />
                <div className={styles.messageContent}>
                  {msg.role === 'user' ? (
                    msg.content
                  ) : (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw]}
                      components={customComponents}
                    >
                      {msg.content.includes('<think>') 
                        ? msg.content.replace(
                            /<think>([\s\S]*?)<\/think>/g,
                            (_, content) => `<div class="${styles.thinkContent}"><div class="${styles.thinkHeader}"><span class="${styles.thinkIcon}"><span class="anticon"><svg viewBox="64 64 896 896" focusable="false" data-icon="bulb" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M632 888H392c-4.4 0-8 3.6-8 8v32c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-32c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-328 328 0 121.4 66 227.4 164 284.1V792c0 17.7 14.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98-56.7 164-162.7 164-284.1 0-181.1-146.9-328-328-328zm127.9 549.8L604 634.6V752H420V634.6l-35.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4 114.6-256 256-256s256 114.6 256 256c0 92.5-49.4 176.3-128.1 221.8z"></path></svg></span></span><span class="${styles.thinkLabel}">深度思考</span></div><div class="${styles.thinkBody}">${content}</div></div>`
                          )
                        : msg.content
                      }
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.inputContainer}>
          <Input
            size="large"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="在HinaBot中输入需求，快速定位"
            prefix={<SearchOutlined />}
            className={styles.searchInput}
            onPressEnter={(e) => sendMessage(e.currentTarget.value)}
            disabled={isLoading}
          />
          <Select
            value={currentModel}
            onChange={setCurrentModel}
            options={models.map(model => ({
              label: model.modelName,
              value: model.modelValue,
            }))}
            loading={models.length === 0}
            placeholder="选择模型"
            className={styles.modelSelect}
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            className={styles.sendButton}
            onClick={() => sendMessage(searchValue)}
            loading={isLoading}
          >
            发送
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HainaBot;
