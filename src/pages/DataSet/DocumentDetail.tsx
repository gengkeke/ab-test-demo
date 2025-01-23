import React, { useEffect, useState } from 'react';
import { Card, Button, Popconfirm, Modal, Space, Form, Input } from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { getFileList, deleteKnowledge, saveKnowledge } from '@/services/dataset/api';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import styles from './DocumentDetail.less';
import { message } from 'antd';

interface DocumentItem {
  id: string;
  content: string;
  metadata: {
    no: number;
    source: string;
    filePath: string;
  };
}

const { TextArea } = Input;

const DocumentDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const source = searchParams.get('source') || '';
  const code = searchParams.get('code') || '';
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<DocumentItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DocumentItem | null>(null);
  const [form] = Form.useForm();

  const fetchDocuments = async () => {
    try {
      const response = await getFileList({
        knowledgeCode: code,
        source: source
      });
      if (response.success) {
        setDocuments(response.data);
      } else {
        message.error(response.message || '获取文档列表失败');
      }
    } catch (error) {
      console.error('获取文档列表失败:', error);
      message.error('获取文档列表失败，请稍后重试');
    }
  };

  useEffect(() => {
    if (code && source) {
      fetchDocuments();
    }
  }, [code, source]);

  const handleBack = () => {
    window.history.back();
  };

  const handleDelete = async (e: React.MouseEvent, id: string, no: number) => {
    e.stopPropagation();
    if (no === 1) {
      message.warning('第一个片段不能删除');
      return;
    }

    try {
      const response = await deleteKnowledge({
        knowledgeCode: code,
        source: source,
        idList: [id]
      });
      if (response.success) {
        message.success('删除成功');
        fetchDocuments();
      } else {
        message.error(response.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      message.error('删除失败，请稍后重试');
    }
  };

  const handleCardClick = (record: DocumentItem) => {
    setSelectedRecord(record);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedRecord(null);
  };

  const handleEdit = (e: React.MouseEvent, record: DocumentItem) => {
    e.stopPropagation();
    setEditingRecord(record);
    setEditModalVisible(true);
    form.setFieldsValue({
      content: record.content
    });
  };

  const handleEditModalClose = () => {
    setEditModalVisible(false);
    setEditingRecord(null);
    form.resetFields();
  };

  const handleEditSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!editingRecord) return;

      const response = await saveKnowledge({
        id: editingRecord.id,
        content: values.content,
        metadata: {
          no: editingRecord.metadata.no,
          source: editingRecord.metadata.source,
          knowledgeCode: code,
          filePath: editingRecord.metadata.filePath || '', // 如果原数据中没有 filePath，使用空字符串
        }
      });

      if (response.success) {
        message.success('保存成功');
        handleEditModalClose();
        // 重新获取列表
        fetchDocuments();
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      message.error('保存失败，请稍后重试');
    }
  };

  // 渲染内容
  const renderContent = (content: string) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
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
    <Card bordered={false} bodyStyle={{ padding: 0 }}>
      <div className={styles.header}>
        <Button 
          type="link" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack}
          style={{ padding: 0 }}
        >
          返回 {source}
        </Button>
      </div>
      <div className={styles.content}>
        <div className={styles.resultsList}>
          {documents.map((item) => (
            <Card 
              key={item.id} 
              className={styles.resultCard}
              onClick={() => handleCardClick(item)}
            >
              <div className={styles.resultHeader}>
                <span className={styles.documentNo}>
                  片段{item.metadata.no}
                </span>
              </div>
              <div className={styles.resultContent}>
                <div className={styles.contentText}>
                  {item.content}
                </div>
              </div>
              <div className={styles.cardFooter}>
                <span className={styles.charCount}>
                  {item.content.length} 字符
                </span>
                <Space>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={(e) => handleEdit(e, item)}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确定要删除这个片段吗？"
                    onConfirm={(e: any) => handleDelete(e, item.id, item.metadata.no)}
                    okText="确定"
                    cancelText="取消"
                    onClick={e => e.stopPropagation()}
                    disabled={item.metadata.no === 1}
                  >
                    <Button 
                      type="link" 
                      danger 
                      icon={<DeleteOutlined />}
                      onClick={e => e.stopPropagation()}
                      disabled={item.metadata.no === 1}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal
        title={`片段${selectedRecord?.metadata.no}`}
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
            <div>{selectedRecord?.content.length} 字符</div>
          </div>
          <div className={styles.modalMainContent}>
            {selectedRecord && renderContent(selectedRecord.content)}
          </div>
        </div>
      </Modal>

      <Modal
        title={`编辑片段${editingRecord?.metadata.no}`}
        open={editModalVisible}
        onCancel={handleEditModalClose}
        onOk={handleEditSubmit}
        okText="保存"
        cancelText="取消"
        width="80%"
        style={{ maxWidth: 1200 }}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="content"
            rules={[{ required: true, message: '请输入内容' }]}
          >
            <TextArea
              rows={15}
              placeholder="请输入内容"
              showCount
              maxLength={5000}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default DocumentDetail; 