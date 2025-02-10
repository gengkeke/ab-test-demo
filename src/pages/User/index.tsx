import { deleteUser, getUserList, modifyUserStatus, saveUser } from '@/services/user/api';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import { Button, Form, Input, message, Modal, Radio, Select } from 'antd';
import React, { useRef, useState } from 'react';

const User: React.FC = () => {
  const [form] = Form.useForm();
  const actionRef = useRef<ActionType>();
  const [modalVisible, setModalVisible] = useState(false);
  const [currentRow, setCurrentRow] = useState<API.UserListItem>();

  // 手机号脱敏处理
  const maskPhoneNumber = (phone: string | undefined) => {
    if (!phone) return '';
    return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  };

  // 角色选项定义
  const roleOptions = [
    { label: '管理员', value: 'administrator' },
    { label: '普通用户', value: 'user' },
  ];

  // 表格列定义
  const columns: ProColumns<API.UserListItem>[] = [
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '手机',
      dataIndex: 'phone',
      render: (_, record) => maskPhoneNumber(record.phone),
    },
    {
      title: '账号',
      dataIndex: 'account',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      valueEnum: {
        administrator: { text: '管理员' },
        user: { text: '普通用户' },
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueEnum: {
        0: { text: '启用', status: 'Success' },
        1: { text: '禁用', status: 'Error' },
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => [
        <a key="edit" onClick={() => handleEdit(record)}>
          编辑
        </a>,
        <a key="status" onClick={() => handleStatusChange(record)}>
          {record.status === 0 ? '禁用' : '启用'}
        </a>,
        <a key="delete" onClick={() => handleDelete(record)}>
          删除
        </a>,
      ],
    },
  ];

  // 处理编辑
  const handleEdit = (record: API.UserListItem) => {
    setCurrentRow(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 处理新增/编辑提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const result = await saveUser({
        ...values,
        id: currentRow?.id,
        status: values.status || 0, // 默认启用
      });
      if (result.success) {
        message.success('保存成功');
        setModalVisible(false);
        actionRef.current?.reload();
      }
    } catch (error) {
      message.error('保存失败');
    }
  };

  // 处理删除
  const handleDelete = async (record: API.UserListItem) => {
    Modal.confirm({
      title: '确认删除',
      content: '确定要删除该用户吗？',
      onOk: async () => {
        if (record.id) {
          const result = await deleteUser({ id: record.id });
          if (result.success) {
            message.success('删除成功');
            actionRef.current?.reload();
          }
        }
      },
    });
  };

  // 处理状态变更
  const handleStatusChange = async (record: API.UserListItem) => {
    if (record.id !== undefined && record.status !== undefined) {
      const newStatus = record.status === 0 ? 1 : 0;
      const result = await modifyUserStatus({
        id: record.id,
        status: newStatus,
      });
      if (result.success) {
        message.success('状态修改成功');
        actionRef.current?.reload();
      }
    }
  };

  return (
    <>
      <ProTable<API.UserListItem>
        headerTitle="用户管理"
        actionRef={actionRef}
        options={{
          search: true,
        }}
        rowKey="id"
        search={false}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="add"
            onClick={() => {
              setCurrentRow(undefined);
              form.resetFields();
              form.setFieldsValue({ status: 0 });
              setModalVisible(true);
            }}
          >
            新增用户
          </Button>,
        ]}
        request={async (params) => {
          const result = await getUserList();
          let filteredData = result.data || [];
          
          if (params.keyword) {
            const keyword = params.keyword.toLowerCase();
            filteredData = filteredData.filter(item => 
              (item.realName?.toLowerCase().includes(keyword) || 
               item.phone?.toLowerCase().includes(keyword))
            );
          }
          
          return {
            data: filteredData,
            success: result.success,
            total: filteredData.length,
          };
        }}
        columns={columns}
      />

      {/* 新增/编辑用户弹窗 */}
      <Modal
        title={currentRow ? '编辑用户' : '新增用户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => setModalVisible(false)}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ status: 0 }}
        >
          <Form.Item
            name="realName"
            label="姓名"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="手机"
            rules={[
              { required: true, message: '请输入手机号' },
              { pattern: /^1\d{10}$/, message: '请输入正确的手机号格式' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="account"
            label="账号"
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { type: 'email', message: '请输入正确的邮箱格式' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="角色"
          >
            <Select
              placeholder="请选择角色"
              options={roleOptions}
            />
          </Form.Item>
          <Form.Item
            name="status"
            label="状态"
          >
            <Radio.Group>
              <Radio value={0}>启用</Radio>
              <Radio value={1}>禁用</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default User;
