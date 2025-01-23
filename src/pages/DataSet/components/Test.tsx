import React, { useState, useMemo } from 'react';
import { Input, Button, Card, Space, Select, message, Modal } from 'antd';
import { SearchOutlined, CopyOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { similaritySearch, SearchResult } from '@/services/dataset/api';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from './Test.less';

const { TextArea } = Input;

const Test: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const [searchText, setSearchText] = useState('');
  const [searchType, setSearchType] = useState('semantic');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SearchResult | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [topK, setTopK] = useState<number>(4);

  const handleSearch = async () => {
    if (!searchText.trim()) {
      return;
    }
    if (!code) {
      message.error('知识库参数错误');
      return;
    }

    setLoading(true);
    try {
      const response = await similaritySearch(searchText, code, topK);
      if (response.success) {
        setSearchResults(response.data);
      } else {
        message.error(response.errorMessage || '搜索失败');
      }
    } catch (error) {
      console.error('搜索失败:', error);
      message.error('搜索失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (record: SearchResult) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  // 渲染内容
  const renderContent = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // 自定义代码块样式
          code: ({ node, inline, className, children, ...props }) => {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.searchSection}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <div>
              <span className={styles.label}>检索方式：</span>
              <Select
                value={searchType}
                onChange={setSearchType}
                style={{ width: '100%' }}
                options={[
                  { label: '语义检索', value: 'semantic' },
                ]}
              />
            </div>
            <div>
              <span className={styles.label}>返回条数：</span>
              <Input
                type="number"
                value={topK}
                onChange={(e) => setTopK(Number(e.target.value))}
                style={{ width: '100%' }}
                min={1}
                max={20}
              />
            </div>
            <div>
              <span className={styles.label}>测试文本：</span>
              <TextArea
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="请输入测试文本"
                rows={4}
              />
            </div>
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={loading}
            >
              检索
            </Button>
          </Space>
        </div>

        <div className={styles.resultsSection}>
          <h3>检索结果</h3>
          <div className={styles.resultsList}>
            {searchResults.map((result, index) => (
              <Card 
                key={index} 
                className={styles.resultCard}
              >
                <div className={styles.resultHeader}>
                  <span className={styles.similarity}>
                    相似度：{result.score.toFixed(4)}
                  </span>
                  <Button
                    type="link"
                    icon={<CopyOutlined />}
                    onClick={() => handleViewRecord(result)}
                  >
                    查看记录
                  </Button>
                </div>
                <div className={styles.resultContent}>
                  <div>
                    <span className={styles.label}>来源</span>
                    <span className={styles.sourceText}>{result.metadata.source}</span>
                  </div>
                  <div className={styles.contentText}>
                    {result.content}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Modal
        title={selectedRecord?.metadata.source}
        open={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            关闭
          </Button>
        ]}
        width="80%"
        style={{ maxWidth: 1200 }}
      >
        <div className={styles.modalContent}>
          <div className={styles.modalInfo}>
            <div>序号：{selectedRecord?.metadata.no}</div>
            <div>相似度：{selectedRecord?.score.toFixed(4)}</div>
          </div>
          <div className={styles.modalMainContent}>
            {selectedRecord && renderContent(selectedRecord.content)}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Test; 