import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { FileOutlined, AimOutlined, SettingOutlined } from '@ant-design/icons';
import styles from './detail.less';
import Document from './components/Document';
import Test from './components/Test';
import Settings from './components/Settings';

const { Content, Sider } = Layout;

const DataSetDetail: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState('document');

  const menuItems = [
    {
      key: 'document',
      icon: <FileOutlined />,
      label: '文档',
    },
    {
      key: 'test',
      icon: <AimOutlined />,
      label: '命中测试',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
  ];

  const renderContent = () => {
    switch (selectedKey) {
      case 'document':
        return <Document />;
      case 'test':
        return <Test />;
      case 'settings':
        return <Settings />;
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

export default DataSetDetail; 