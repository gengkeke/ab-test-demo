import React, {useState, useEffect} from 'react';
import {Card, Form, Input, Modal, message, Row, Col, Button, Avatar} from 'antd';
import {FileTextOutlined, InfoCircleOutlined, PlusOutlined, SettingOutlined, EditOutlined, DeleteOutlined} from '@ant-design/icons';
import styles from './index.less';
import {useNavigate} from 'react-router-dom';
import { getKnowledgeList, saveKnowledgeBase, deleteKnowledge } from '@/services/dataset/api';
import type { KnowledgeBaseRes } from '@/services/dataset/typings';

const {TextArea} = Input;

const DataSet: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeBaseRes[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string>('');

  // 获取知识库列表
  const fetchKnowledgeList = async () => {
    try {
      setLoading(true);
      const res = await getKnowledgeList();
      if (res.success) {
        setKnowledgeList(res.data || []);
      } else {
        message.error(res.message || '获取知识库列表失败');
      }
    } catch (error) {
      message.error('获取知识库列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeList();
  }, []);

  const showModal = (id?: string, record?: KnowledgeBaseRes) => {
    setEditingId(id || '');
    if (record) {
      form.setFieldsValue({
        name: record.knowledgeName,
        description: record.knowledgeDescription,
      });
    }
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingId('');
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const params = {
          ...(editingId ? { id: editingId } : {}),
          knowledgeName: values.name,
          knowledgeDescription: values.description || '',
        };
        const res = await saveKnowledgeBase(params);
        if (res.success) {
          message.success(editingId ? '更新知识库成功' : '创建知识库成功');
          setIsModalOpen(false);
          setEditingId('');
          form.resetFields();
          fetchKnowledgeList();
        } else {
          message.error(res.message || (editingId ? '更新知识库失败' : '创建知识库失败'));
        }
      } catch (error) {
        message.error(editingId ? '更新知识库失败' : '创建知识库失败');
      }
    });
  };

  const handleCardClick = (id: string) => {
    navigate(`/dataset/detail?id=${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteKnowledge(id);
      if (res.success) {
        message.success('删除知识库成功');
        fetchKnowledgeList();
      } else {
        message.error(res.message || '删除知识库失败');
      }
    } catch (error) {
      message.error('删除知识库失败');
    }
  };

  // 获取颜色
  const getAvatarColor = (str: string) => {
    const colors = [
      '#1677ff', '#13c2c2', '#52c41a', '#faad14',  // 蓝、青、绿、黄
      '#722ed1', '#eb2f96', '#fadb14', '#a0d911',  // 紫、粉、亮黄、青柠
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>知识库管理</h2>
      </div>

      <Row gutter={[16, 16]}>
        {/* 添加知识库卡片 */}
        <Col xs={24} sm={12} md={8} xl={6}>
          <Card
            hoverable
            style={{ height: '100%', cursor: 'pointer' }}
            bodyStyle={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '32px 24px',
            }}
            onClick={() => showModal()}
          >
            <div style={{ 
              width: 40,
              height: 40,
              borderRadius: 6,
              background: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}>
              <PlusOutlined style={{ fontSize: 24, color: '#722ed1' }} />
            </div>
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#722ed1' }}>添加知识库</div>
            <div style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
              创建一个新的知识库
            </div>
          </Card>
        </Col>

        {/* 知识库列表卡片 */}
        {knowledgeList.map((item) => (
          <Col key={item.id} xs={24} sm={12} md={8} xl={6}>
            <Card
              hoverable
              style={{ height: '100%' }}
              onClick={() => handleCardClick(item.id)}
              actions={[
                <Button 
                  type="link" 
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    showModal(item.id, item);
                  }}
                >
                  编辑
                </Button>,
                <Button 
                  type="link" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                >
                  删除
                </Button>,
              ]}
            >
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <Avatar
                    size={40}
                    shape="square"
                    style={{ 
                      backgroundColor: getAvatarColor(item.knowledgeName),
                      marginRight: 12,
                      borderRadius: 6,
                    }}
                  >
                    {item.knowledgeName.charAt(0).toUpperCase()}
                  </Avatar>
                  <div style={{ fontSize: '16px', fontWeight: 500 }}>{item.knowledgeName}</div>
                </div>
                <div style={{ color: '#666', marginTop: 8 }}>{item.knowledgeDescription || '暂无描述'}</div>
              </div>
              <div style={{ color: '#666' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>文档数：</span>
                  <span>{item.documentCount || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>分段数：</span>
                  <span>{item.chunkCount || 0}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 创建/编辑知识库弹窗 */}
      <Modal
        title={editingId ? '编辑知识库' : '创建知识库'}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        cancelText="取消"
        okText="确定"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label={<span className={styles.required}>知识库名称</span>}
            name="name"
            rules={[{required: true, message: '请输入知识库名称'}]}
          >
            <Input
              placeholder="给你的知识库取一个名字吧"
              maxLength={20}
              showCount
            />
          </Form.Item>
          <Form.Item
            label="知识库描述"
            name="description"
          >
            <TextArea
              placeholder="请输入知识库描述"
              rows={4}
            />
          </Form.Item>
          <div className={styles.tip}>
            <InfoCircleOutlined/>
            <span>知识库需绑定到知识应用才可生效</span>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DataSet;
