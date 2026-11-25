export type UserRole = 'admin' | 'member' | 'viewer'
export type UserStatus = 'active' | 'invited' | 'disabled'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  createdAt: string
  updatedAt: string
}

export interface UserQuery {
  page?: number
  pageSize?: number
  keyword?: string
  role?: UserRole | ''
  status?: UserStatus | ''
}

export type UserInput = {
  name: string
  email: string
  role: UserRole
  status: UserStatus
}

export const USER_ROLE_OPTIONS = [
  { label: '管理员', value: 'admin' },
  { label: '成员', value: 'member' },
  { label: '访客', value: 'viewer' },
] as const

export const USER_STATUS_OPTIONS = [
  { label: '正常', value: 'active' },
  { label: '待邀请', value: 'invited' },
  { label: '已停用', value: 'disabled' },
] as const
