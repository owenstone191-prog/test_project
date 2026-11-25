import type { Project } from '../../modules/projects/types'
import type { User } from '../../modules/users/types'

const seedUsers: User[] = [
  {
    id: 'usr_001',
    name: '陈可',
    email: 'chenke@ops.local',
    role: 'admin',
    status: 'active',
    createdAt: '2025-09-01T08:00:00.000Z',
    updatedAt: '2025-11-01T08:00:00.000Z',
  },
  {
    id: 'usr_002',
    name: '林晓',
    email: 'linxiao@ops.local',
    role: 'member',
    status: 'active',
    createdAt: '2025-09-12T09:30:00.000Z',
    updatedAt: '2025-10-20T11:00:00.000Z',
  },
  {
    id: 'usr_003',
    name: '周宁',
    email: 'zhouning@ops.local',
    role: 'viewer',
    status: 'invited',
    createdAt: '2025-10-03T10:00:00.000Z',
    updatedAt: '2025-10-03T10:00:00.000Z',
  },
  {
    id: 'usr_004',
    name: '赵敏',
    email: 'zhaomin@ops.local',
    role: 'member',
    status: 'disabled',
    createdAt: '2025-08-18T07:20:00.000Z',
    updatedAt: '2025-11-10T14:00:00.000Z',
  },
  {
    id: 'usr_005',
    name: '韩雨',
    email: 'hanyu@ops.local',
    role: 'member',
    status: 'active',
    createdAt: '2025-10-22T13:15:00.000Z',
    updatedAt: '2025-11-18T09:40:00.000Z',
  },
]

const seedProjects: Project[] = [
  {
    id: 'prj_001',
    name: '计费中台',
    code: 'billing-core',
    env: 'prod',
    status: 'active',
    owner: '陈可',
    description: '订阅与用量计量服务',
    createdAt: '2025-07-01T02:00:00.000Z',
    updatedAt: '2025-11-20T04:00:00.000Z',
  },
  {
    id: 'prj_002',
    name: '控制台前端',
    code: 'ops-console',
    env: 'staging',
    status: 'active',
    owner: '林晓',
    description: '内部运营后台',
    createdAt: '2025-08-10T03:00:00.000Z',
    updatedAt: '2025-11-22T06:30:00.000Z',
  },
  {
    id: 'prj_003',
    name: '通知网关',
    code: 'notify-gw',
    env: 'dev',
    status: 'paused',
    owner: '韩雨',
    description: '邮件与站内信通道',
    createdAt: '2025-09-05T05:00:00.000Z',
    updatedAt: '2025-11-05T08:00:00.000Z',
  },
  {
    id: 'prj_004',
    name: '旧版报表',
    code: 'legacy-report',
    env: 'prod',
    status: 'archived',
    owner: '赵敏',
    description: '待下线的报表服务',
    createdAt: '2024-12-01T01:00:00.000Z',
    updatedAt: '2025-10-01T01:00:00.000Z',
  },
]

export const db = {
  users: [...seedUsers],
  projects: [...seedProjects],
}

export function resetStore(): void {
  db.users = [...seedUsers]
  db.projects = [...seedProjects]
}
