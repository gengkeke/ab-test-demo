import type {RequestOptions} from '@@/plugin-request/request';
import type {RequestConfig} from '@umijs/max';
import {history} from '@umijs/max';
import {message} from 'antd';

// 与后端约定的响应数据格式
interface ResponseStructure {
  status?: number;
  code?: number;
  message?: string;
  success: boolean;
  data: any;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const {success, data, code, message} =
        res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(message);
        error.name = 'BizError';
        error.info = {code, message, data};
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          message.error(errorInfo.message);
        }
      } else if (error.response?.status == 401) {
        // 请求成功发出且服务器也响应了状态码，但状态代码403
        history.push('/user/login');
      } else if (error.response?.data) {
        if (error.response?.data?.msg) {
          message.error(`${error.response.data?.msg}`);
        } else {
          message.error(`${error.response.data}`);
        }
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [(config: RequestOptions) => {
    // 从 localStorage 获取用户信息
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const {token} = JSON.parse(userInfo);
      if (token) {
        const headers = {
          ...config.headers,
          'Auth': token,
        };
        return {...config, headers};
      }
    }
    return config;
  }],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 拦截响应数据，进行个性化处理
      const {data} = response as unknown as ResponseStructure;
      if (data?.success === false) {
        message.error('请求失败！');
      }
      return response;
    },
  ],
};
