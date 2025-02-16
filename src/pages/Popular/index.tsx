import React from 'react';
import { List, Card } from 'antd';
import styles from './index.less';

const Popular: React.FC = () => {
  const tools = [
    {
      title: 'Trae',
      desc: '字节跳动推出的免费AI编程工具，基于Claude模型',
      icon: 'https://ai-bot.cn/wp-content/uploads/2025/01/trae-logo-3.png',
      url: 'https://trae.ai/'
    },
    {
      title: '通义灵码',
      desc: '阿里推出的免费AI编程工具，基于通义大模型',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/12/tongyi-lingma-icon-1.png',
      url: 'https://click.aliyun.com/m/1000399943'
    },
    {
      title: '代码小浣熊',
      desc: '商汤科技推出的免费AI编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/12/sensetime-raccoon-code-icon.png',
      url: 'https://xiaohuanxiong.paluai.com/code'
    },
    {
      title: '豆包AI编程',
      desc: '豆包推出的AI编程新功能',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/08/doubao-icon.png',
      url: 'https://www.doubao.com/'
    },
    {
      title: 'CodeWhisperer',
      desc: '亚马逊推出的免费AI编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/04/codewhisperer-icon.png',
      url: 'https://aws.amazon.com/codewhisperer'
    },
    {
      title: 'GitHub Copilot',
      desc: 'GitHub推出的AI编程工具',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/03/github-copilot-icon.png',
      url: 'https://github.com/features/copilot'
    },
    {
      title: '豆包MarsCode',
      desc: '字节推出的免费AI编程助手，基于豆包大模型',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/05/marscode-icon.png',
      url: 'https://marscode.paluai.com/doubao'
    },
    {
      title: '文心快码',
      desc: '百度推出的AI编程助手，基于文心大模型',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/08/comate-baidu-logo.png',
      url: 'https://comate.baidu.com/'
    },
    {
      title: 'Cursor',
      desc: 'AI代码编辑器，快速进行编程开发',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/08/cursor-logo.png',
      url: 'https://www.cursor.com/'
    },
    {
      title: 'Windsurf',
      desc: 'Codeium公司推出的AI编程工具',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/11/Windsurf-logo.png',
      url: 'https://windsurf.io/'
    },
    {
      title: 'Bolt.new',
      desc: 'StackBlitz 推出的全栈AI代码工具',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/10/Bolt.new-logo.png',
      url: 'https://bolt.new/'
    },
    {
      title: 'Replit Agent',
      desc: 'AI初创公司Replit推出的AI编程工具',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/09/Replit-Agent-logo.png',
      url: 'https://replit.com/'
    },
    {
      title: 'Lovable',
      desc: 'AI编程工具，用自然对话快速构建网站和Web应用',
      icon: 'https://ai-bot.cn/wp-content/uploads/2025/02/Lovable-logo.png',
      url: 'https://lovable.ai/'
    },
    {
      title: 'Junie',
      desc: 'JetBrains 推出的 AI 编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2025/01/Junie-logo-1.png',
      url: 'https://www.jetbrains.com/junie/'
    },
    {
      title: 'CodeGeeX',
      desc: '智谱AI推出的免费AI编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/04/codegeex-icon.png',
      url: 'https://codegeex.cn/'
    },
    {
      title: '腾讯云AI代码助手',
      desc: '腾讯推出的AI编程辅助工具',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/05/tencent-cloud-ai-code-assistant-icon.png',
      url: 'https://cloud.tencent.com/product/acc'
    },
    {
      title: 'Codeium',
      desc: '免费的AI编程工具，智能生成和补全代码',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/03/codeium-icon.png',
      url: 'https://codeium.com/'
    },
    {
      title: '码上飞',
      desc: 'AI软件开发平台，一句话自动生成端到端应用',
      icon: 'https://ai-bot.cn/wp-content/uploads/2025/02/codeflying-logo.png',
      url: 'https://codeflying.com/'
    },
    {
      title: 'Cody',
      desc: 'Sourcegraph推出的免费AI编程工具',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/05/sourcegraph-cody-icon.png',
      url: 'https://about.sourcegraph.com/cody'
    },
    {
      title: 'DevChat',
      desc: '开源的支持多款大模型的AI编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/01/devchat-icon.png',
      url: 'https://www.devchat.ai/'
    },
    {
      title: 'CodiumAI',
      desc: '免费的AI代码测试和分析工具',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/03/codiumai-icon.png',
      url: 'https://www.codium.ai/'
    },
    {
      title: 'Genie',
      desc: 'Cosine AI推出的AI编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/08/genie-logo.png',
      url: 'https://www.cosine.ai/'
    },
    {
      title: 'iFlyCode',
      desc: '科大讯飞推出的智能编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/08/iflycode-icon.png',
      url: 'https://iflycode.xfyun.cn/'
    },
    {
      title: 'Twinny',
      desc: '专为 VS Code 设计的AI代码补全插件',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/09/twinny-logo.png',
      url: 'https://twinny.dev/'
    },
    {
      title: 'Project IDX',
      desc: '谷歌推出的AI云端开发和代码编辑器',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/05/project-idx-icon.png',
      url: 'https://idx.dev/'
    },
    {
      title: 'Sketch2Code',
      desc: '微软AI Lab推出的将手绘草图转换成HTML代码工具',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/03/sketch2code-icon.png',
      url: 'https://sketch2code.azurewebsites.net/'
    },
    {
      title: 'CodeFuse',
      desc: '蚂蚁集团推出的AI代码编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/10/codefuse-icon.png',
      url: 'https://codefuse.alipay.com/'
    },
    {
      title: 'Tabby',
      desc: '免费开源的自托管AI编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/03/tabby-ai-icon.png',
      url: 'https://tabby.tabbyml.com/'
    },
    {
      title: 'C知道',
      desc: 'CSDN推出的AI技术问答工具',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/05/so-csdn-logo.png',
      url: 'https://so.csdn.net/chat'
    },
    {
      title: '驭码CodeRider',
      desc: '极狐GitLab推出的AI编程与软件智能研发助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/05/coderider-icon.png',
      url: 'https://coderider.gitlab.cn/'
    },
    {
      title: 'Duo Chat',
      desc: 'GitLab推出的AI编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/04/gitlab-duo-chat-icon.png',
      url: 'https://about.gitlab.com/gitlab-duo/'
    },
    {
      title: 'CodeRabbit',
      desc: 'AI驱动的代码审查平台',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/05/coderabbit-icon.png',
      url: 'https://coderabbit.ai/'
    },
    {
      title: 'Augment',
      desc: 'AI编程辅助工具，专为大型代码库设计',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/04/augment-code-icon.png',
      url: 'https://www.augmentcode.com/'
    },
    {
      title: 'Devin',
      desc: '首个全自主的AI软件工程师智能体',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/03/devin-ai.png',
      url: 'https://preview.devin.ai/'
    },
    {
      title: 'Plandex',
      desc: '免费开源的基于终端的AI编程引擎',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/04/plandex-icon.png',
      url: 'https://plandex.ai/'
    },
    {
      title: 'Fitten Code',
      desc: '非十科技推出的免费AI代码助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2024/01/fitten-code-icon.png',
      url: 'https://code.fittentech.com/'
    },
    {
      title: 'BLACKBOX AI',
      desc: '黑箱AI编程助理，快速代码生成',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/04/blackbox-ai-icon.png',
      url: 'https://www.useblackbox.io/'
    },
    {
      title: 'Solo',
      desc: 'Mozilla推出的零编程无代码AI网站建设工具',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/12/solo-ai-website-composer-icon.png',
      url: 'https://soloist.ai/'
    },
    {
      title: 'JetBrains AI',
      desc: 'JetBrains推出的AI编程开发助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/12/jetbrains-ai-icon.png',
      url: 'https://www.jetbrains.com/ai/'
    },
    {
      title: 'CodeArts Snap',
      desc: '华为云推出的智能编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/06/codearts-snap-icon.png',
      url: 'https://www.huaweicloud.com/product/codeartside/snap.html'
    },
    {
      title: 'AskCodi',
      desc: '你的个人AI编程助手',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/03/askcodi-icon.png',
      url: 'https://www.askcodi.com/'
    },
    {
      title: 'v0.dev',
      desc: 'AI生成前端React/UI组件，由Vercel推出',
      icon: 'https://ai-bot.cn/wp-content/uploads/2023/09/v0-dev-icon.png',
      url: 'https://v0.dev/'
    }
  ];

  return (
    <div className={styles.container}>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={tools}
        renderItem={(item) => (
          <List.Item>
            <Card 
              className={styles.card}
              bodyStyle={{ padding: '16px' }}
              onClick={() => window.open(item.url, '_blank')}
            >
              <div className={styles.content}>
                <img src={item.icon} alt={item.title} className={styles.icon} />
                <div className={styles.info}>
                  <div className={styles.title}>{item.title}</div>
                  <div className={styles.desc}>{item.desc}</div>
                </div>
              </div>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Popular;
