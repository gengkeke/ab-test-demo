import React, {useState, useEffect} from 'react';
import {Card, Form, Input, Modal, message} from 'antd';
import {FileTextOutlined, InfoCircleOutlined, PlusOutlined, SettingOutlined} from '@ant-design/icons';
import styles from './index.less';
import {useNavigate} from 'react-router-dom';
import { getKnowledgeList, saveKnowledgeBase } from '@/services/dataset/api';
import type { KnowledgeDO } from '@/services/dataset/api';

const {TextArea} = Input;

const DataSet: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [knowledgeList, setKnowledgeList] = useState<KnowledgeDO[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取知识库列表
  const fetchKnowledgeList = async () => {
    try {
      setLoading(true);
      const res = await getKnowledgeList();
      if (res.success) {
        setKnowledgeList(res.data || []);
      } else {
        message.error(res.message || '获取知识库列表失败');
      }
    } catch (error) {
      message.error('获取知识库列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledgeList();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleOk = () => {
    form.validateFields().then(async (values) => {
      try {
        const params: KnowledgeDO = {
          knowledgeCode: values.code,
          knowledgeName: values.name,
          description: values.description || '',
        };
        const res = await saveKnowledgeBase(params);
        if (res.success) {
          message.success('创建知识库成功');
          setIsModalOpen(false);
          form.resetFields();
          fetchKnowledgeList();
        } else {
          message.error(res.message || '创建知识库失败');
        }
      } catch (error) {
        message.error('创建知识库失败');
      }
    });
  };

  const handleCardClick = (code: string) => {
    navigate(`/dataset/detail?code=${code}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.cardList}>
        {/* 知识库列表卡片 */}
        {knowledgeList.map((item) => (
          <Card 
            key={item.knowledgeCode} 
            className={styles.card} 
            onClick={() => handleCardClick(item.knowledgeCode)}
          >
            <div className={styles.settingIcon}>
              <SettingOutlined/>
            </div>
            <div className={styles.cardContent}>
              <div className={styles.headerRow}>
                <div className={styles.iconWrapper}>
                  <FileTextOutlined/>
                </div>
                <div className={styles.titleWrapper}>{item.knowledgeName}</div>
              </div>
              {item.description && (
                <div className={styles.description}>{item.description}</div>
              )}
            </div>
          </Card>
        ))}

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
            label={<span className={styles.required}>知识库编码</span>}
            name="code"
            rules={[
              { required: true, message: '请输入知识库编码' },
              { 
                pattern: /^[a-zA-Z0-9]+$/, 
                message: '只能输入英文和数字' 
              }
            ]}
          >
            <Input
              placeholder="请输入知识库编码，只能使用英文和数字"
              maxLength={30}
            />
          </Form.Item>
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
