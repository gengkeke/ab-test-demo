import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { useSearchParams } from 'react-router-dom';

const { TextArea } = Input;

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code') || '';

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        name: code,
        code: code,
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
        label="知识库Code"
        name="code"
      >
        <Input disabled />
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
          <Button type="primary">保存</Button>
          <Button>删除</Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default Settings; 