import { request } from '@umijs/max';

/** 获取用户列表 GET /gateway/ai/user/list */
export async function getUserList(options?: { [key: string]: any }) {
  return request<API.UserList>('/gateway/ai/user/list', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 删除用户 POST /gateway/ai/user/delete */
export async function deleteUser(
  params: {
    id: string;
  },
  options?: { [key: string]: any }
) {
  return request<API.DeleteUserResult>('/gateway/ai/user/delete', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}

/** 保存用户 POST /gateway/ai/user/save */
export async function saveUser(
  data: API.SaveUserParams,
  options?: { [key: string]: any }
) {
  return request<API.SaveUserResult>('/gateway/ai/user/save', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

/** 修改用户状态 POST /gateway/ai/user/modifyStatus */
export async function modifyUserStatus(
  data: API.ModifyUserStatusParams,
  options?: { [key: string]: any }
) {
  return request<API.ModifyUserStatusResult>('/gateway/ai/user/modifyStatus', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

