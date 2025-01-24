// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Captcha = {
    code?: number;
  };

  type LoginParams = {
    phone?: string;
    code?: string;
    weixinCode?: string;
  };

  type LoginResultData = {
    id?: string;
    realName?: string;
    role?: string;
    token?: string;
  };

  type CurrentUser = {
    id?: string;
    realName?: string;
    role?: string;
    token?: string;
  };

  type LoginResult = Result<LoginResultData>;
}
