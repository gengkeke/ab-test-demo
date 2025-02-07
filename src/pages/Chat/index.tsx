import React, {useEffect, useRef, useState, useCallback} from 'react';
import {Avatar, Button, Input, Layout, List, Menu, message, Select, Modal, InputNumber} from 'antd';
import {PlusOutlined, SendOutlined, UserOutlined, RobotOutlined, DeleteOutlined} from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {vscDarkPlus} from 'react-syntax-highlighter/dist/esm/styles/prism';
import {chatCompletions, handleStreamResponse, type Message, getModels} from '@/services/chat/api';
import {type ModelOption, getKnowledgeList} from '@/services/dataset/api';
import styles from './index.less';

// 导入自定义头像图片

const {Header, Sider, Content} = Layout;
const {TextArea} = Input;

// 本地存储的键名
const STORAGE_KEY = 'chat_sessions';
const CURRENT_SESSION_KEY = 'current_session_id';

// 预设提示词列表
const PROMPT_EXAMPLES = [
  {
    icon: '💡',
    title: '例子',
    prompts: ['介绍一下你自己', '帮我生成详尽的工作周报，以及本周的心得体会',
      '请使用鸡汤文风格写一则生动的文案', '请用SWOT帮我分析一下"在线短剧"',
      '使用[python]写[文本相似度分析]的代码']
  }
];

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

interface KnowledgeDO {
  knowledgeName: string;
  knowledgeCode: string;
}

const Chat: React.FC = () => {
  // 状态管理
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    // 从本地存储加载会话
    const savedSessions = localStorage.getItem(STORAGE_KEY);
    return savedSessions ? JSON.parse(savedSessions) : [{
      id: '1',
      title: '新对话',
      messages: [],
    }];
  });

  const [currentSessionId, setCurrentSessionId] = useState(() => {
    // 从本地存储加载当前会话ID
    return localStorage.getItem(CURRENT_SESSION_KEY) || '1';
  });

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState<ModelOption[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [temperature, setTemperature] = useState<number>(0.6);
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeDO[]>([]);
  const [selectedKnowledge, setSelectedKnowledge] = useState<string[]>([]);

  // 用于取消请求
  const abortController = useRef<AbortController | null>(null);

  // 获取当前会话
  const currentSession = sessions.find((s) => s.id === currentSessionId);

  // 保存会话到本地存储
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  // 保存当前会话ID到本地存储
  useEffect(() => {
    localStorage.setItem(CURRENT_SESSION_KEY, currentSessionId);
  }, [currentSessionId]);

  // 获取知识库列表
  useEffect(() => {
    const fetchKnowledgeList = async () => {
      try {
        const response = await getKnowledgeList();
        if (response.success && response.data) {
          setKnowledgeList(response.data);
        }
      } catch (error) {
        console.error('获取知识库列表失败:', error);
        message.error('获取知识库列表失败');
      }
    };
    fetchKnowledgeList();
  }, []);

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

  // 创建新会话
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: '新对话',
      messages: [],
    };
    setSessions(prevSessions => [...prevSessions, newSession]);
    setCurrentSessionId(newSession.id);
  };

  // 删除会话
  const deleteSession = (sessionId: string) => {
    setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionId));
    if (currentSessionId === sessionId) {
      const remainingSessions = sessions.filter(session => session.id !== sessionId);
      if (remainingSessions.length > 0) {
        setCurrentSessionId(remainingSessions[0].id);
      } else {
        createNewSession();
      }
    }
  };

  // 重命名会话
  const renameSession = (sessionId: string, newTitle: string) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? {...session, title: newTitle}
          : session
      )
    );
  };

  // 更新会话消息
  const updateSessionMessages = (sessionId: string, newMessages: Message[]) => {
    setSessions(prevSessions =>
      prevSessions.map(session =>
        session.id === sessionId
          ? {
            ...session,
            messages: [...newMessages],
            // 如果是第一条消息，用它更新标题
            title: session.messages.length === 0 && newMessages.length > 0
              ? newMessages[0].content.slice(0, 20) + '...'
              : session.title,
          }
          : session
      )
    );
  };

  // 添加防抖函数
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  };

  // 使用 useRef 来存储当前的流式内容
  const streamContentRef = useRef('');
  const displayContentRef = useRef('');
  const pendingContentRef = useRef('');
  const animationFrameRef = useRef<number>();
  
  // 创建打字机效果的更新函数
  const updateWithTypingEffect = useCallback((sessionId: string, currentMessages: Message[], newContent: string) => {
    if (pendingContentRef.current !== newContent) {
      pendingContentRef.current = newContent;
      if (!animationFrameRef.current) {
        const animate = () => {
          if (displayContentRef.current.length < pendingContentRef.current.length) {
            // 每次添加一个字符
            displayContentRef.current = pendingContentRef.current.slice(0, displayContentRef.current.length + 1);
            
            const messagesWithTyping: Message[] = [
              ...currentMessages,
              {
                role: 'assistant' as const,
                content: displayContentRef.current,
              },
            ];
            
            setSessions(prevSessions =>
              prevSessions.map(session =>
                session.id === sessionId
                  ? {...session, messages: messagesWithTyping}
                  : session
              )
            );
            
            animationFrameRef.current = requestAnimationFrame(animate);
          } else {
            animationFrameRef.current = undefined;
          }
        };
        animationFrameRef.current = requestAnimationFrame(animate);
      }
    }
  }, []);

  // 修改发送消息的处理函数
  const handleSend = async () => {
    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: inputValue.trim(),
    };

    setInputValue('');

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

    // 创建新的消息数组
    const currentMessages = [...(currentSession?.messages || []), userMessage];

    // 更新用户消息
    updateSessionMessages(currentSessionId, currentMessages);
    
    try {
      setLoading(true);

      const response = await chatCompletions(
        {
          messages: currentMessages,
          stream: true,
          model: currentModel,
          temperature: temperature,
          ...(selectedKnowledge.length > 0 ? { knowledgeCodeList: selectedKnowledge } : {}),
        },
        abortController.current.signal,
      );

      if (response instanceof Response) {
        await handleStreamResponse(
          response,
          (chunk) => {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              streamContentRef.current += content;
              // 使用打字机效果更新内容
              updateWithTypingEffect(currentSessionId, currentMessages, streamContentRef.current);
            }
          },
          (error) => {
            console.error('Stream error:', error);
            message.error('接收消息出错');
          },
          () => {
            // 流式响应结束时，确保显示完整内容
            const finalMessages: Message[] = [
              ...currentMessages,
              {
                role: 'assistant' as const,
                content: streamContentRef.current,
              },
            ];
            updateSessionMessages(currentSessionId, finalMessages);
            setLoading(false);
            abortController.current = null;
          },
        );
      } else {
        // 处理非流式响应
        const content = response.choices[0]?.message?.content || '';
        const messagesWithResponse: Message[] = [
          ...currentMessages,
          {
            role: 'assistant' as const,
            content: content,
          },
        ];
        updateSessionMessages(currentSessionId, messagesWithResponse);
        setLoading(false);
        abortController.current = null;
      }
    } catch (error) {
      console.error('Chat error:', error);
      message.error('发送消息失败');
      setLoading(false);
      abortController.current = null;
    }
  };

  // 自定义代码块渲染
  const CodeBlock = ({language, value}: { language: string; value: string }) => {
    return (
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers
        wrapLines
      >
        {value}
      </SyntaxHighlighter>
    );
  };

  // 处理提示词点击
  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  // 添加清空所有会话的处理函数
  const handleClearAllSessions = () => {
    Modal.confirm({
      title: '确认清空所有会话',
      content: '此操作将删除所有聊天记录，且不可恢复，是否继续？',
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        // 保留当前会话，但清空消息
        setSessions([{
          id: Date.now().toString(),
          title: '新对话',
          messages: [],
        }]);
        setCurrentSessionId(Date.now().toString());
      },
    });
  };

  // 在组件卸载时清理
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <Layout className={styles.chatContainer}>
      <Sider width={250} className={styles.sider}>
        <Button
          type="primary"
          icon={<PlusOutlined/>}
          onClick={createNewSession}
          className={styles.newChatButton}
        >
          新建对话
        </Button>
        <div className={styles.siderContent}>
          <Menu
            mode="inline"
            selectedKeys={[currentSessionId]}
            onSelect={({key}) => setCurrentSessionId(key)}
          >
            {sessions.map((session) => (
              <Menu.Item
                key={session.id}
                title={session.title}
                className={styles.sessionItem}
              >
                <div className={styles.sessionTitle}>
                  <span>{session.title}</span>
                  <Button
                    type="link"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className={styles.deleteButton}
                  >
                    删除
                  </Button>
                </div>
              </Menu.Item>
            ))}
          </Menu>
          <div className={styles.clearButtonWrapper}>
            <Button
              type="text"
              icon={<DeleteOutlined />}
              onClick={handleClearAllSessions}
              className={styles.clearButton}
              block
            >
              清空所有会话
            </Button>
          </div>
        </div>
      </Sider>

      <Layout>
        <Content className={styles.chatContent}>
          {(!currentSession?.messages || currentSession.messages.length === 0) ? (
            <div className={styles.emptyState}>
              {PROMPT_EXAMPLES.map((section) => (
                <div key={section.title} className={styles.promptSection}>
                  <div className={styles.promptTitle}>
                    <span className={styles.icon}>{section.icon}</span>
                    {section.title}
                  </div>
                  <div className={styles.promptList}>
                    {section.prompts.map((prompt) => (
                      <div
                        key={prompt}
                        className={styles.promptItem}
                        onClick={() => handlePromptClick(prompt)}
                      >
                        {prompt}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <List
              className={styles.messageList}
              dataSource={currentSession?.messages || []}
              renderItem={(message, index) => (
                <List.Item
                  key={`${currentSessionId}-${index}-${message.content.slice(0, 10)}`}
                  className={`${styles.messageItem} ${styles[message.role]}`}
                >
                  <div className={styles.messageRow}>
                    <Avatar
                      className={styles.avatar}
                      icon={message.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                    />
                    <div className={styles.messageContent}>
                      {message.role === 'user' ? (
                        message.content
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeRaw, rehypeSanitize]}
                          components={{
                            code({node, inline, className, children, ...props}) {
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
                            // 自定义其他 Markdown 元素的渲染
                            table({children}) {
                              return (
                                <div className={styles.tableWrapper}>
                                  <table>{children}</table>
                                </div>
                              );
                            },
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </List.Item>
              )}
            />
          )}
          <div className={styles.inputArea}>
            <div className={styles.modelSelector}>
              <InputNumber
                value={temperature}
                onChange={(value) => setTemperature(value || 0.6)}
                min={0}
                max={2}
                step={0.1}
                precision={1}
                style={{ width: 100, marginRight: 8 }}
                addonBefore="温度"
              />
              <div className={styles.knowledgeSelectWrapper}>
                <span className={styles.knowledgeLabel}>知识库</span>
                <Select
                  mode="multiple"
                  value={selectedKnowledge}
                  onChange={setSelectedKnowledge}
                  options={knowledgeList.map(knowledge => ({
                    label: knowledge.knowledgeName,
                    value: knowledge.knowledgeCode,
                  }))}
                  placeholder="请选择知识库"
                  style={{ minWidth: 200 }}
                />
              </div>
              <div className={styles.modelSelectWrapper}>
                <span className={styles.modelLabel}>模型</span>
                <Select
                  value={currentModel}
                  onChange={setCurrentModel}
                  options={models.map(model => ({
                    label: model.modelName,
                    value: model.modelValue,
                  }))}
                  loading={models.length === 0}
                  placeholder="请选择模型"
                />
              </div>
            </div>
            <div className={styles.inputWrapper}>
              <TextArea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="输入问题..."
                autoSize={{minRows: 3, maxRows: 5}}
                onPressEnter={(e) => {
                  if (!e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                type="text"
                icon={<SendOutlined/>}
                onClick={handleSend}
                loading={loading}
                className={styles.sendButton}
              />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Chat;
