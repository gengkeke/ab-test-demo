import React, { useEffect } from 'react';
import { Form, Input, Button, Space, message, Modal } from 'antd';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getKnowledgeById, deleteKnowledgeBase, saveKnowledgeBase } from '@/services/dataset/api';
import type { KnowledgeBaseRes } from '@/services/dataset/typings';

const { TextArea } = Input;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id') || '';

  // 获取知识库信息
  const fetchKnowledgeInfo = async () => {
    try {
      const res = await getKnowledgeById(id);
      if (res.success) {
        form.setFieldsValue({
          name: res.data.knowledgeName,
          description: res.data.knowledgeDescription,
        });
      } else {
        message.error(res.message || '获取知识库信息失败');
      }
    } catch (error) {
      message.error('获取知识库信息失败');
    }
  };

  useEffect(() => {
    if (id) {
      fetchKnowledgeInfo();
    }
  }, [id]);

  // 删除知识库
  const handleDelete = () => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该知识库吗？删除后不可恢复',
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          const res = await deleteKnowledgeBase(id);
          if (res.success) {
            message.success('删除成功');
            navigate('/dataset');
          } else {
            message.error(res.message || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  // 保存知识库
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const params: Partial<KnowledgeBaseRes> = {
        id,
        knowledgeName: values.name,
        knowledgeDescription: values.description,
      };
      const res = await saveKnowledgeBase(params);
      if (res.success) {
        message.success('保存成功');
        navigate('/dataset');
      } else {
        message.error(res.message || '保存失败');
      }
    } catch (error) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('保存失败');
      }
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        name: '',
        description: '',
      }}
    >
      <Form.Item
        label="知识库名称"
        name="name"
        rules={[{ required: true, message: '请输入知识库名称' }]}
      >
        <Input placeholder="给你的知识库取一个名字吧" maxLength={20} showCount />
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
      
      <Form.Item>
        <Space>
          <Button type="primary" onClick={handleSave}>保存</Button>
          <Button danger onClick={handleDelete}>删除</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default Settings; 