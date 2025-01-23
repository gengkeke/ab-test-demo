import React, {useEffect, useState} from 'react';
import {useNavigate, useSearchParams} from 'react-router-dom';
import {Button, Card, Input, InputNumber, message, Modal, Space, Table, Upload} from 'antd';
import {InboxOutlined, ReloadOutlined} from '@ant-design/icons';
import {addContent, deleteKnowledge, getFileList} from '@/services/dataset/api';
import styles from './Document.less';

const {Search} = Input;
const {confirm} = Modal;

interface FileItem {
  content: string;
  id: string;
  metadata: {
    no: number;
    source: string;
    filePath?: string;
  };
  score: number;
}

const Document: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const [fileList, setFileList] = useState<FileItem[]>([]);
  const [filteredList, setFilteredList] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [chunkSize, setChunkSize] = useState<number | null>(null);

  const handleView = (record: FileItem) => {
    navigate(`/dataset/documentDetail?source=${record.metadata.source}&code=${code}`);
  };

  const handleDelete = async (record: FileItem) => {
    if (!code) return;

    confirm({
      title: '删除文档',
      content: `确定要删除文件 "${record.metadata.source}" 吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteKnowledge({
            knowledgeCode: code,
            source: record.metadata.source
          });
          message.success('删除成功');
          fetchFileList();
        } catch (error) {
          console.error('删除失败:', error);
          message.error('删除失败');
        }
      }
    });
  };

  const handleDownload = (filePath: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 80,
      align: 'center' as const,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: '文件名称',
      dataIndex: ['metadata', 'source'],
      key: 'fileName',
      ellipsis: true,
      width: '60%',
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center' as const,
      render: (_: any, record: FileItem) => (
        <Space size={8}>
          <Button
            size="small"
            onClick={() => handleView(record)}
            type='primary'
            style={{fontSize: 12}}
          >
            查看
          </Button>
          {record.metadata.filePath && (
            <Button
              size="small"
              onClick={() => handleDownload(record.metadata.filePath!, record.metadata.source)}
              type='primary'
              style={{fontSize: 12}}
            >
              下载
            </Button>
          )}
          <Button
            size="small"
            onClick={() => handleDelete(record)}
            type='primary'
            danger
            style={{fontSize: 12}}
          >
            删除
          </Button>
        </Space>
      ),
    }
  ];

  const fetchFileList = async () => {
    if (!code) return;

    setLoading(true);
    try {
      const response = await getFileList({knowledgeCode: code, no: 1});
      setFileList(response.data || []);
      setFilteredList(response.data || []);
    } catch (error) {
      console.error('获取文件列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFileList();
  }, [code]);

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = fileList.filter(item =>
      item.metadata.source.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredList(filtered);
  };

  const handleUpload = async () => {
    if (!uploadFile || !code) {
      message.error('请选择要上传的文件');
      return;
    }

    try {
      await addContent({
        file: uploadFile,
        knowledgeCode: code,
        chunkSize: chunkSize || undefined,
      });
      message.success('文件上传成功');
      setIsModalVisible(false);
      setUploadFile(null);
      setChunkSize(null);
      fetchFileList();
    } catch (error) {
      console.error('上传文件失败:', error);
      message.error('文件上传失败');
    }
  };

  const handleAddDocument = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setUploadFile(null);
  };

  return (
    <Card bordered={false} bodyStyle={{padding: 0}}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16
      }}>
        <Space>
          <Button
            type="primary"
            onClick={handleAddDocument}
          >
            添加文档
          </Button>
          <Button
            icon={<ReloadOutlined/>}
            onClick={fetchFileList}
          >
            刷新
          </Button>
        </Space>
        <Search
          placeholder="请输入文件名搜索"
          allowClear
          onSearch={handleSearch}
          onChange={e => handleSearch(e.target.value)}
          style={{width: 300}}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredList}
        loading={loading}
        rowKey="id"
        size="middle"
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条`,
          position: ['bottomRight']
        }}
        className={styles.documentTable}
      />
      <Modal
        title="上传文档"
        open={isModalVisible}
        onOk={handleUpload}
        onCancel={handleModalCancel}
        okText="确定"
        cancelText="取消"
      >
        <div style={{marginBottom: 16}}>
          <div style={{marginBottom: 8}}>
            分段大小：
            <span style={{
              fontSize: '12px',
              color: '#666',
              marginLeft: '8px'
            }}>
              (注:CSV文件将按行分段,此设置对CSV文件无效)
            </span>
          </div>
          <InputNumber
            value={chunkSize}
            onChange={(value) => setChunkSize(value)}
            style={{width: '100%'}}
            addonAfter="tokens"
            placeholder="根据向量模型自动限制"
          />
        </div>
        <Upload.Dragger
          beforeUpload={(file) => {
            setUploadFile(file);
            return false;
          }}
          onRemove={() => {
            setUploadFile(null);
          }}
          maxCount={1}
          fileList={uploadFile ? [uploadFile] : []}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
        </Upload.Dragger>
        <div style={{
          marginTop: 16,
          padding: '8px 12px',
          background: '#f5f5f5',
          borderRadius: 4,
          fontSize: '12px',
          color: '#666'
        }}>
          <div>温馨提示：</div>
          <div>文件处理为异步操作，上传成功后请稍后刷新列表查看处理结果。</div>
        </div>
      </Modal>
    </Card>
  );
};

export default Document;
