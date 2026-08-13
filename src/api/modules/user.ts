/**
 * 用户 / 账户模块
 * 个人资料、安全设置、密码修改
 */
import request from '../request';
import type { ApiResponse } from '../types';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  company?: string;
  role?: string;
}

/** 获取个人资料 */
export function fetchProfile(): Promise<ApiResponse<UserProfile>> {
  return request.get('/user/profile');
}

/** 更新个人资料 */
export function updateProfile(payload: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
  return request.put('/user/profile', payload);
}

/** 修改密码 */
export function changePassword(payload: {
  oldPassword: string;
  newPassword: string;
}): Promise<ApiResponse<null>> {
  return request.post('/user/change-password', payload);
}
