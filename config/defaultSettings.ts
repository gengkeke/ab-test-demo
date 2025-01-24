import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  colorPrimary: '#8b62f7',
  layout: 'mix',
  contentWidth: 'Fixed',
  fixedHeader: true,
  fixSiderbar: true,
  colorWeak: false,
  splitMenus: true,
  title: ' ',
  pwa: true,
  logo: 'https://himanual.haishuu.com/static/images/hinahishu.png',
  iconfontUrl: '',
  token: {

    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    bgLayout: '#fff',
    header: {
      colorTextMenu:'rgba(0,0,0,0.9)',
      colorTextMenuSelected: 'rgb(107,10,201)',
      colorTextMenuActive: 'rgb(107,10,201)',
      colorBgMenuItemHover: 'rgba(149, 128, 247, 0.1)',
      //colorBgMenuItemHover: 'rgba(0,0,0,0.06)',
      //colorBgMenuItemSelected: 'rgba(0,0,0,0.15)',
      //colorTextMenuSecondary: 'rgba(255,255,255,0.65)',
      //colorTextMenuActive: 'rgba(255,255,255,0.95)',
      //colorBgRightActionsItemHover: 'rgba(0,0,0,0.07)',
      colorTextRightActionsItem: 'rgba(0,0,0,0.9)',

    },
  },
};

export default Settings;
