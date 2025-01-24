import {getCaptcha, login} from '@/services/user/login';
import {LockOutlined, MobileOutlined,} from '@ant-design/icons';
import {LoginForm, ProFormCaptcha, ProFormText,} from '@ant-design/pro-components';
import {Helmet, history, useModel} from '@umijs/max';
import {message} from 'antd';
import {createStyles} from 'antd-style';
import React from 'react';
import {flushSync} from 'react-dom';

const useStyles = createStyles(({token}) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});
const Login: React.FC = () => {
  const {initialState, setInitialState} = useModel('@@initialState');
  const {styles} = useStyles();
  const fetchUserInfo = async (data: API.LoginResultData) => {
    const userInfo = await initialState?.fetchUserInfo?.(data);
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };
  const handleSubmit = async (values: API.LoginParams) => {
    // 登录
    const result = await login({
      ...values,
    });
    if (result.success) {
      message.success('登录成功');
      await fetchUserInfo(result.data);
      const urlParams = new URL(window.location.href).searchParams;
      history.push(urlParams.get('redirect') || '/');
      return;
    }
  };
  return (
    <div className={styles.container}>
      <Helmet>
        <title>登录</title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/hinahishu.png"/>}
          subTitle={'欢迎使用海纳致远AI系统'}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          <ProFormText
            fieldProps={{
              size: 'large',
              prefix: <MobileOutlined/>,
            }}
            name="phone"
            placeholder={'请输入手机号'}
            rules={[
              {
                required: true,
                message: '手机号是必填项',
              },
              {
                pattern: /^1\d{10}$/,
                message: '不合法的手机号',
              },
            ]}
          />
          <ProFormCaptcha
            phoneName="phone"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined/>,
            }}
            captchaProps={{
              size: 'large',
            }}
            placeholder={'请输入验证码'}
            captchaTextRender={(timing, count) => {
              if (timing) {
                return `${count} ${'秒后重新获取'}`;
              }
              return '获取验证码';
            }}
            name="code"
            rules={[
              {
                required: true,
                message: '验证码是必填项',
              },
            ]}
            onGetCaptcha={async (phone) => {
              const result = await getCaptcha({
                phone,
              });
              if (!result) {
                return;
              }
              message.success('获取验证码成功');
            }}
          />
        </LoginForm>
      </div>
    </div>
  );
};
export default Login;
