/**
 * 账号角色枚举
 * 数值越小权限越高
 */
export enum AccountRole {
  /** 超级管理员 */
  SU = 0,
  /** 管理员 */
  ADMIN = 1,
  /** 普通用户 */
  USER = 2,
}

export type User = {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role?: AccountRole;
};

export type Profile = User & {
  authorities: string[];
  otpStatus?: 0 | 1;
  atlassianBindStatus?: 0 | 1;
  role: AccountRole;
};
