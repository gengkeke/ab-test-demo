import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Modal, Form, Input, Select, message, Badge, Upload, Avatar } from 'antd';
import { PlusOutlined, UploadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { getModelList, saveModel, deleteModel } from '@/services/model/api';
import type { ModelRes } from '@/services/model/typings';
import { uploadFile } from '@/services/file/api';
import type { UploadFile } from 'antd/es/upload/interface';

const MODEL_TYPE_OPTIONS = [
  { value: 'LLM', label: '大语言模型' },
  { value: 'EMBEDDING', label: '向量模型' },
  { value: 'STT', label: '语音识别' },
  { value: 'TTS', label: '语音合成' },
  { value: 'IMAGE', label: '图片理解' },
  { value: 'TTI', label: '图片生成' },
  { value: 'RERANKER', label: '重排模型' },
] as const;

const Model: React.FC = () => {
  const [models, setModels] = useState<ModelRes[]>([]);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchModels = async () => {
    try {
      const response = await getModelList();
      if (response.success) {
        setModels(response.data);
      } else {
        message.error(response.message || '获取模型列表失败');
      }
    } catch (error) {
      message.error('获取模型列表失败');
    }
  };

  useEffect(() => {
    fetchModels();
  }, []);

  const handleSave = async (values: any) => {
    try {
      const response = await saveModel({
        ...values,
        id: editingId || undefined,
      });
      if (response.success) {
        message.success('保存成功');
        setVisible(false);
        form.resetFields();
        fetchModels();
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
      content: '确定要删除该模型吗？删除后不可恢复',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteModel(id);
          if (response.success) {
            message.success('删除成功');
            fetchModels();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const getAvatarColor = (str: string) => {
    const colors = [
      '#1677ff', '#13c2c2', '#52c41a', '#faad14',
      '#722ed1', '#eb2f96', '#fadb14', '#a0d911',
    ];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const getConnectionStatusBadge = (status: number) => {
    const statusMap: Record<number, { status: string; text: string }> = {
      0: { status: 'default', text: '未连接' },
      1: { status: 'success', text: '已连接' },
      2: { status: 'error', text: '连接失败' },
    };
    return statusMap[status] || statusMap[0];
  };

  const getModelTypeText = (type: string) => {
    return MODEL_TYPE_OPTIONS.find(option => option.value === type)?.label || type;
  };

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>模型管理</h2>
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
            onClick={() => {
              setEditingId(null);
              setVisible(true);
            }}
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
            <div style={{ fontSize: '16px', fontWeight: 500, color: '#722ed1' }}>添加模型</div>
            <div style={{ color: '#666', marginTop: 8, textAlign: 'center' }}>
              创建一个新的模型
            </div>
          </Card>
        </Col>

        {models.map((model) => (
          <Col key={model.id} xs={24} sm={12} md={8} xl={6}>
            <Card
              hoverable
              style={{ height: '100%' }}
              actions={[
                <Button 
                  type="link" 
                  icon={<EditOutlined />}
                  style={{ color: '#722ed1' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(model.id);
                    form.setFieldsValue({
                      ...model,
                      providerIcon: model.providerIcon ? [{
                        uid: '-1',
                        name: 'icon',
                        status: 'done',
                        url: model.providerIcon,
                      }] : [],
                    });
                    setVisible(true);
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
                    handleDelete(model.id);
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
                      backgroundColor: getAvatarColor(model.modelName),
                      marginRight: 12,
                      borderRadius: 6,
                    }}
                  >
                    {model.modelName.charAt(0).toUpperCase()}
                  </Avatar>
                  <div style={{ fontSize: '16px', fontWeight: 500 }}>{model.modelName}</div>
                </div>
                <div style={{ color: '#666', marginTop: 8 }}>
                  <div style={{ marginBottom: 8 }}>提供商：{model.providerName}</div>
                  <div>类型：{getModelTypeText(model.modelType)}</div>
                </div>
              </div>
              <div style={{ color: '#666' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>连接状态：</span>
                  <Badge 
                    status={getConnectionStatusBadge(model.connectionStatus).status as any}
                    text={getConnectionStatusBadge(model.connectionStatus).text}
                  />
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={editingId ? '编辑模型' : '添加模型'}
        open={visible}
        onCancel={() => {
          setVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        width={800}
        bodyStyle={{ maxHeight: '70vh', overflow: 'auto' }}
      >
        <Form
          form={form}
          onFinish={handleSave}
          layout="vertical"
          requiredMark="optional"
        >
          <Row gutter={24}>
            <Col span={24}>
              <div style={{ 
                padding: '12px 16px', 
                background: '#f5f5f5', 
                borderRadius: '6px',
                marginBottom: 24
              }}>
                <h3 style={{ margin: '0 0 8px 0' }}>基本信息</h3>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="providerName"
                      label="供应商名称"
                      rules={[{ required: true, message: '请输入供应商名称' }]}
                    >
                      <Input placeholder="请输入供应商名称" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="providerType"
                      label="供应商类型"
                    >
                      <Select placeholder="请选择供应商类型">
                        <Select.Option value="OpenAI">OpenAI</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      name="providerIcon"
                      label="供应商图标"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e?.fileList;
                      }}
                    >
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        showUploadList={true}
                        customRequest={async ({ file, onSuccess, onError }) => {
                          try {
                            const response = await uploadFile(file as File);
                            if (response.success) {
                              form.setFieldsValue({
                                providerIcon: response.data
                              });
                              onSuccess?.(response);
                            } else {
                              message.error(response.message || '上传失败');
                              onError?.(new Error(response.message));
                            }
                          } catch (error) {
                            message.error('上传失败');
                            onError?.(error as Error);
                          }
                        }}
                      >
                        <div>
                          <UploadOutlined />
                          <div style={{ marginTop: 8 }}>上传图标</div>
                        </div>
                      </Upload>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
            
            <Col span={24}>
              <div style={{ 
                padding: '12px 16px', 
                background: '#f5f5f5', 
                borderRadius: '6px',
                marginBottom: 24
              }}>
                <h3 style={{ margin: '0 0 8px 0' }}>API配置</h3>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="apiBaseUrl"
                      label="API地址"
                      rules={[{ required: true, message: '请输入API地址' }]}
                    >
                      <Input placeholder="请输入API地址" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="apiKey"
                      label="API密钥"
                    >
                      <Input.Password placeholder="请输入API密钥" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>

            <Col span={24}>
              <div style={{ 
                padding: '12px 16px', 
                background: '#f5f5f5', 
                borderRadius: '6px' 
              }}>
                <h3 style={{ margin: '0 0 8px 0' }}>模型配置</h3>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="modelId"
                      label="模型ID"
                      rules={[{ required: true, message: '请输入模型ID' }]}
                    >
                      <Input placeholder="例如 gpt-3.5-turbo" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="modelName"
                      label="模型名称"
                      rules={[{ required: true, message: '请输入模型名称' }]}
                    >
                      <Input placeholder="例如 GPT-3.5" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="modelType"
                      label="模型类型"
                      rules={[{ required: true, message: '请选择模型类型' }]}
                    >
                      <Select placeholder="请选择模型类型">
                        {MODEL_TYPE_OPTIONS.map(option => (
                          <Select.Option key={option.value} value={option.value}>
                            {option.label}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="status"
                      label="状态"
                      rules={[{ required: true, message: '请选择状态' }]}
                    >
                      <Select placeholder="请选择状态">
                        <Select.Option value={1}>启用</Select.Option>
                        <Select.Option value={0}>禁用</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Model;
