import React, { useEffect, useState } from 'react';
import { Layout, Menu, Form, message } from 'antd';
import { SettingOutlined, AimOutlined, KeyOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { getApplicationById } from '@/services/application/api';
import { getModelList } from '@/services/model/api';
import { getKnowledgeList } from '@/services/dataset/api';
import type { ModelRes } from '@/services/model/typings';
import type { KnowledgeBaseRes } from '@/services/dataset/typings';
import Settings from './components/Settings';
import ApiKeys from './components/ApiKeys';
import styles from './detail.less';

const { Content, Sider } = Layout;

const Test: React.FC = () => {
  return (
    <div>命中测试页面开发中...</div>
  );
};

const ApplicationDetail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [form] = Form.useForm();
  const [models, setModels] = useState<ModelRes[]>([]);
  const [knowledgeBases, setKnowledgeBases] = useState<KnowledgeBaseRes[]>([]);
  const [selectedKey, setSelectedKey] = useState('settings');

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  const fetchData = async () => {
    try {
      const [modelRes, knowledgeRes, appRes] = await Promise.all([
        getModelList(),
        getKnowledgeList(),
        getApplicationById({ id: id! }),
      ]);

      if (modelRes.success) {
        setModels(modelRes.data);
      }
      if (knowledgeRes.success) {
        setKnowledgeBases(knowledgeRes.data);
      }
      if (appRes?.success) {
        form.setFieldsValue(appRes.data);
      }
    } catch (error) {
      message.error('获取数据失败');
    }
  };

  const menuItems = [
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      key: 'test',
      icon: <AimOutlined />,
      label: '命中测试',
    },
    {
      key: 'apikeys',
      icon: <KeyOutlined />,
      label: 'API Key',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'settings':
        return <Settings form={form} models={models} knowledgeBases={knowledgeBases} />;
      case 'test':
        return <Test />;
      case 'apikeys':
        return <ApiKeys />;
      default:
        return null;
    }
  };

  return (
    <Layout className={styles.container}>
      <Sider width={200} className={styles.sider}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ height: '100%', borderRight: 0 }}
          items={menuItems}
          onClick={({ key }) => setSelectedKey(key)}
        />
      </Sider>
      <Content className={styles.content}>
        <div className={styles.contentWrapper}>
          {renderContent()}
        </div>
      </Content>
    </Layout>
  );
};

export default ApplicationDetail; 