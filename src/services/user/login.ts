// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

export async function getCaptcha(params: { phone?: string;},options?: { [key: string]: any },) {
  return request<API.Captcha>('/gateway/ai/auth/captcha', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 登录接口 POST */
export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/gateway/ai/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}