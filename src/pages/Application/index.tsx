import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Input, InputNumber, Switch, message, Avatar } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getApplicationList, saveApplication, deleteApplication } from '@/services/application/api';
import type { ApplicationRes } from '@/services/application/typings';
import { getModelList } from '@/services/model/api';
import type { ModelRes } from '@/services/model/typings';
import { Select } from 'antd';
import { getKnowledgeList } from '@/services/dataset/api';
import type { KnowledgeBaseRes } from '@/services/dataset/typings';

const Application: React.FC = () => {
  const [applications, setApplications] = useState<ApplicationRes[]>([]);
  const [models, setModels] = useState<ModelRes[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseRes[]>([]);

  const fetchApplications = async () => {
    try {
      const response = await getApplicationList();
      if (response.success) {
        setApplications(response.data);
      } else {
        message.error(response.message || '获取应用列表失败');
      }
    } catch (error) {
      message.error('获取应用列表失败');
    }
  };

  const fetchModels = async () => {
    try {
      const response = await getModelList();
      if (response.success) {
        setModels(response.data);
      }
    } catch (error) {
      message.error('获取模型列表失败');
    }
  };

  const fetchKnowledgeBases = async () => {
    try {
      const response = await getKnowledgeList();
      if (response.success) {
        setKnowledgeBases(response.data);
      }
    } catch (error) {
      message.error('获取知识库列表失败');
    }
  };

  useEffect(() => {
    fetchApplications();
    fetchModels();
    fetchKnowledgeBases();
  }, []);

  const handleSave = async (values: any) => {
    try {
      const response = await saveApplication(values);
      if (response.success) {
        message.success('保存成功');
        setVisible(false);
        form.resetFields();
        navigate(`/application/detail?id=${response.data}`);
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleDelete = async (id: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该应用吗？删除后不可恢复',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteApplication({ id });
          if (response.success) {
            message.success('删除成功');
            fetchApplications();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
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
        <h2 style={{ margin: 0 }}>应用管理</h2>
      </div>

      <Row gutter={[16, 16]}>
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
            onClick={() => setVisible(true)}
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
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#722ed1' }}>添加应用</div>
            <div style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
              创建一个新的应用
            </div>
          </Card>
        </Col>

        {applications.map((app) => (
          <Col key={app.id} xs={24} sm={12} md={8} xl={6}>
            <Card
              hoverable
              style={{ height: '100%' }}
              onClick={() => navigate(`/application/detail?id=${app.id}`)}
              actions={[
                <Button 
                  type="link" 
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    navigate(`/application/detail?id=${app.id}`);
                  }}
                >
                  编辑
                </Button>,
                <Button 
                  type="link" 
                  danger 
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    handleDelete(app.id);
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
                      backgroundColor: getAvatarColor(app.appName),
                      marginRight: 12,
                      borderRadius: 6,
                    }}
                  >
                    {app.appName.charAt(0).toUpperCase()}
                  </Avatar>
                  <div style={{ fontSize: '16px', fontWeight: 500 }}>{app.appName}</div>
                </div>
                <div style={{ color: '#666', marginTop: 8 }}>{app.appDescription || '暂无描述'}</div>
              </div>
              <div style={{ color: '#666' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>模型：</span>
                  <span>{models.find(m => m.id == app.modelId)?.modelName || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>温度：</span>
                  <span>{app.temperature || '-'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>历史记录数：</span>
                  <span>{app.historyRecords || '-'}</span>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title="添加应用"
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form
          form={form}
          onFinish={handleSave}
          layout="vertical"
        >
          <Form.Item
            name="appName"
            label="应用名称"
            rules={[{ required: true, message: '请输入应用名称' }]}
          >
            <Input placeholder="请输入应用名称" />
          </Form.Item>
          <Form.Item
            name="appDescription"
            label="应用描述"
          >
            <Input.TextArea rows={4} placeholder="请输入应用描述" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Application;
