import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Switch, Button, Select, Space, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getApplicationById, saveApplication } from '@/services/application/api';
import type { ModelRes } from '@/services/model/typings';
import type { KnowledgeBaseRes } from '@/services/dataset/typings';

const { TextArea } = Input;

interface SettingsProps {
  form: any;
  models: ModelRes[];
  knowledgeBases: KnowledgeBaseRes[];
}

const Settings: React.FC<SettingsProps> = ({ 
  form, 
  models, 
  knowledgeBases,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) {
      fetchApplicationDetail();
    }
  }, [id]);

  const fetchApplicationDetail = async () => {
    try {
      const response = await getApplicationById({ id: id! });
      if (response.success) {
        form.setFieldsValue(response.data);
      } else {
        message.error(response.message || '获取应用详情失败');
      }
    } catch (error) {
      message.error('获取应用详情失败');
    }
  };

  const handleSave = async (values: any) => {
    try {
      const response = await saveApplication({
        ...values,
        id,
      });
      if (response.success) {
        message.success('保存成功');
        navigate('/application');
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      message.error('保存失败');
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSave}
      layout="vertical"
      requiredMark="optional"
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
        <TextArea rows={4} placeholder="描述该应用的应用场景及用途，如：XXX 小助手回答用户提出的 XXX 产品使用问题" />
      </Form.Item>

      <Form.Item
        name="modelId"
        label="AI模型"
        rules={[{ required: true, message: '请选择AI模型' }]}
      >
        <Select placeholder="请选择AI模型">
          {models.map(model => (
            <Select.Option key={model.id} value={model.id}>
              {model.modelName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="temperature"
        label="温度"
      >
        <InputNumber min={0} max={1} step={0.1} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="historyRecords"
        label="历史记录数"
      >
        <InputNumber min={0} style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        name="roleSetting"
        label="角色设定"
      >
        <TextArea rows={4} placeholder="请输入角色设定" />
      </Form.Item>

      <Form.Item
        name="promptNoKnowledge"
        label="无知识库提示词"
      >
        <TextArea rows={4} placeholder="请输入无知识库提示词" />
      </Form.Item>

      <div style={{ 
        padding: '12px 16px', 
        background: '#f5f5f5', 
        borderRadius: '6px',
        marginBottom: 24
      }}>
        <h3 style={{ margin: '0 0 8px 0' }}>知识库配置</h3>
        <Form.Item
          name="knowledgeBaseIds"
          label="关联知识库"
        >
          <Select
            placeholder="请选择知识库"
            allowClear
            mode="multiple"
            showSearch
            optionFilterProp="children"
          >
            {knowledgeBases.map(kb => (
              <Select.Option key={kb.id} value={kb.id}>
                {kb.knowledgeName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="promptWithKnowledge"
          label="提示词 (引用知识库)"
        >
          <TextArea rows={4} placeholder="已知信息：{data}
用户问题：{question}
回答要求：
 - 请使用中文回答用户问题" />
        </Form.Item>

        <Form.Item
          name="similarityThreshold"
          label="相似度高于"
        >
          <InputNumber min={0} max={1} step={0.1} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="topReferences"
          label="引用分段数 TOP"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="maxReferenceChars"
          label="最多引用字符数"
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="showKnowledgeSource"
          label="显示知识来源"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>
      </div>

      <Form.Item
        name="openingStatement"
        label="开场白"
      >
        <TextArea rows={4} placeholder="您好，我是 XXX 小助手，您可以向我提出 XXX 使用问题。
- XXX 主要功能有什么？
- XXX 如何收费？
- 需要转人工服务" />
      </Form.Item>

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
          <Button onClick={() => navigate('/application')}>
            返回
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default Settings; 