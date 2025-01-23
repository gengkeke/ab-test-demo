import React, {useState} from 'react';
import {Card, Form, Input, Modal} from 'antd';
import {FileTextOutlined, InfoCircleOutlined, PlusOutlined, SettingOutlined} from '@ant-design/icons';
import styles from './index.less';
import {useNavigate} from 'react-router-dom';

const {TextArea} = Input;

const DataSet: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      console.log(values);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const handleCardClick = (code: string) => {
    navigate(`/dataset/detail?code=${code}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardList}>
        {/* 海纳嗨数卡片 */}
        <Card className={styles.card} onClick={() => handleCardClick('haishubot')}>
          <div className={styles.settingIcon}>
            <SettingOutlined/>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.iconWrapper}>
              <FileTextOutlined/>
            </div>
            <div className={styles.titleWrapper}>海纳嗨数</div>
          </div>
        </Card>

         {/* 海纳内部卡片 */}
         <Card className={styles.card} onClick={() => handleCardClick('chatbot')}>
          <div className={styles.settingIcon}>
            <SettingOutlined/>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.iconWrapper}>
              <FileTextOutlined/>
            </div>
            <div className={styles.titleWrapper}>海纳内部</div>
          </div>
        </Card>

         {/* 测试卡片 */}
         <Card className={styles.card} onClick={() => handleCardClick('test')}>
          <div className={styles.settingIcon}>
            <SettingOutlined/>
          </div>
          <div className={styles.cardContent}>
            <div className={styles.iconWrapper}>
              <FileTextOutlined/>
            </div>
            <div className={styles.titleWrapper}>测试</div>
          </div>
        </Card>

        {/* 创建知识库卡片 */}
        <Card className={`${styles.card} ${styles.addCard}`} onClick={showModal}>
          <div className={styles.addContent}>
            <div className={styles.addIconWrapper}>
              <PlusOutlined/>
            </div>
            <span className={styles.addText}>创建知识库</span>
          </div>
        </Card>
      </div>

      {/* 创建知识库弹窗 */}
      <Modal
        title="创建知识库"
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
