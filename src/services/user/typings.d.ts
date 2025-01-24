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

  // 用户列表项类型
  type UserListItem = {
    id?: string;
    account?: string;
    realName?: string;
    email?: string;
    phone?: string;
    userProfile?: string;
    corpUserId?: string;
    role?: string;
    status?: number;
  };

  // 用户列表响应类型
  type UserList = Result<UserListItem[]>;

  // 删除用户响应类型
  type DeleteUserResult = Result<boolean>;

  // 保存用户请求参数类型
  type SaveUserParams = {
    id?: string;
    account?: string;
    realName?: string;
    email?: string;
    phone?: string;
    role?: string;
    userProfile?: string;
    status?: number;  // 0启用1禁用
  };

  // 保存用户响应类型
  type SaveUserResult = Result<boolean>;

  // 修改用户状态请求参数类型
  type ModifyUserStatusParams = {
    id: string;      // @NotNull
    status: number;  // @NotNull 0启用1禁用
  };

  // 修改用户状态响应类型
  type ModifyUserStatusResult = Result<boolean>;
}
