/**
 * 认证模块
 * 登录 / 注销 / 获取当前用户信息 / 刷新 token
 */
import request from '../request';
import type { ApiResponse } from '../types';

export interface LoginPayload {
  username: string;
  password: string;
  captcha?: string;
}

export interface LoginResult {
  token: string;
  refreshToken?: string;
  userInfo: {
    id: string;
    name: string;
    role?: string;
    avatar?: string;
  };
}

/** 登录 */
export function login(payload: LoginPayload): Promise<ApiResponse<LoginResult>> {
  return request.post('/auth/login', payload);
}

/** 注销 */
export function logout(): Promise<ApiResponse<null>> {
  return request.post('/auth/logout');
}

/** 获取当前登录用户信息 */
export function fetchCurrentUser(): Promise<ApiResponse<LoginResult['userInfo']>> {
  return request.get('/auth/current');
}

/** 刷新 token */
export function refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string }>> {
  return request.post('/auth/refresh', { refreshToken });
}
