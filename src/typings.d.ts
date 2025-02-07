declare module 'slash2';
declare module '*.css';
declare module '*.less' {
  const content: { [className: string]: string };
  export default content;
}
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';
declare module 'omit.js';
declare module 'numeral';
declare module '@antv/data-set';
declare module 'mockjs';
declare module 'react-fittext';
declare module 'bizcharts-plugin-slider';

// 定义全局的 Result 类型
declare type Result<T> = {
  status: number;
  code: string;
  message: string;
  success: boolean;
  data: T;
};

declare const REACT_APP_ENV: 'test' | 'dev' | 'pre' | false;

// 声明 rehype-sanitize 模块
declare module 'rehype-sanitize' {
  const defaultSchema: any;
  const rehypeSanitize: any;
  export { defaultSchema };
  export default rehypeSanitize;
}

// 扩展 react-markdown 的组件类型
declare module 'react-markdown' {
  import { ReactNode, ComponentType } from 'react';

  interface ReactMarkdownProps {
    children: string;
    remarkPlugins?: any[];
    rehypePlugins?: any[];
    components?: {
      [key: string]: ComponentType<any>;
    };
  }

  const ReactMarkdown: ComponentType<ReactMarkdownProps>;
  export = ReactMarkdown;

  export interface Components {
    p?: ComponentType<{
      children?: ReactNode;
      [key: string]: any;
    }>;
    think?: ComponentType<{
      children?: ReactNode;
    }>;
    code?: ComponentType<{
      node?: any;
      inline?: boolean;
      className?: string;
      children?: ReactNode;
      [key: string]: any;
    }>;
    table?: ComponentType<{
      children?: ReactNode;
    }>;
  }
}
