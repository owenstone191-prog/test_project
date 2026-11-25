export type ProjectEnv = 'dev' | 'staging' | 'prod'
export type ProjectStatus = 'active' | 'paused' | 'archived'

export interface Project {
  id: string
  name: string
  code: string
  env: ProjectEnv
  status: ProjectStatus
  owner: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface ProjectQuery {
  page?: number
  pageSize?: number
  keyword?: string
  env?: ProjectEnv | ''
  status?: ProjectStatus | ''
}

export type ProjectInput = {
  name: string
  code: string
  env: ProjectEnv
  status: ProjectStatus
  owner: string
  description: string
}

export const PROJECT_ENV_OPTIONS = [
  { label: '开发', value: 'dev' },
  { label: '预发', value: 'staging' },
  { label: '生产', value: 'prod' },
] as const

export const PROJECT_STATUS_OPTIONS = [
  { label: '进行中', value: 'active' },
  { label: '已暂停', value: 'paused' },
  { label: '已归档', value: 'archived' },
] as const
