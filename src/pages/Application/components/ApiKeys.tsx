import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message, Switch } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { getApiKeyList, saveApiKey, deleteApiKey, modifyApiKeyStatus } from '@/services/application/api';
import type { ApiKeyRes } from '@/services/application/typings';

const ApiKeys: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyRes[]>([]);
  const [form] = Form.useForm();

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await getApiKeyList({ applicationId: id! });
      if (response.success) {
        setApiKeys(response.data);
      } else {
        message.error(response.message || '获取API Key列表失败');
      }
    } catch (error) {
      message.error('获取API Key列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchApiKeys();
    }
  }, [id]);

  const handleSave = async (values: any) => {
    try {
      const response = await saveApiKey({
        ...values,
        applicationId: id!,
      });
      if (response.success) {
        message.success('保存成功');
        setVisible(false);
        form.resetFields();
        fetchApiKeys();
      } else {
        message.error(response.message || '保存失败');
      }
    } catch (error) {
      message.error('保存失败');
    }
  };

  const handleDelete = (keyId: string) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该API Key吗？删除后不可恢复',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          const response = await deleteApiKey({ id: keyId });
          if (response.success) {
            message.success('删除成功');
            fetchApiKeys();
          } else {
            message.error(response.message || '删除失败');
          }
        } catch (error) {
          message.error('删除失败');
        }
      }
    });
  };

  const handleStatusChange = async (keyId: string, status: boolean) => {
    try {
      const response = await modifyApiKeyStatus({ id: keyId, status });
      if (response.success) {
        message.success('状态修改成功');
        fetchApiKeys();
      } else {
        message.error(response.message || '状态修改失败');
      }
    } catch (error) {
      message.error('状态修改失败');
    }
  };

  const columns = [
    {
      title: 'Key名称',
      dataIndex: 'keyName',
      key: 'keyName',
    },
    {
      title: 'API Key',
      dataIndex: 'apiKey',
      key: 'apiKey',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean, record: ApiKeyRes) => (
        <Switch
          checked={status}
          onChange={(checked) => handleStatusChange(record.id, checked)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ApiKeyRes) => (
        <Button type="link" danger onClick={() => handleDelete(record.id)}>
          删除
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => setVisible(true)}>
          新增API Key
        </Button>
      </div>

      <Table
        loading={loading}
        columns={columns}
        dataSource={apiKeys}
        rowKey="id"
      />

      <Modal
        title="新增API Key"
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
            name="keyName"
            label="Key名称"
            rules={[{ required: true, message: '请输入Key名称' }]}
          >
            <Input placeholder="请输入Key名称" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ApiKeys; 