import type { PageResult } from '../types/common'
import type { User, UserInput, UserQuery } from '../modules/users/types'
import { createId, nowIso } from '../utils/format'
import { ApiError, apiRequest, paginate } from './client'
import { db } from './mock/store'

function matchUser(user: User, query: UserQuery): boolean {
  const keyword = query.keyword?.trim().toLowerCase()
  if (keyword) {
    const hay = `${user.name} ${user.email}`.toLowerCase()
    if (!hay.includes(keyword)) return false
  }
  if (query.role && user.role !== query.role) return false
  if (query.status && user.status !== query.status) return false
  return true
}

export function listUsers(query: UserQuery = {}): Promise<PageResult<User>> {
  return apiRequest({
    path: '/users',
    method: 'GET',
    query: {
      page: query.page,
      pageSize: query.pageSize,
      keyword: query.keyword,
      role: query.role,
      status: query.status,
    },
    mock: () => {
      const filtered = db.users
        .filter((item) => matchUser(item, query))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      return paginate(filtered, query.page, query.pageSize)
    },
  })
}

export function createUser(input: UserInput): Promise<User> {
  return apiRequest({
    path: '/users',
    method: 'POST',
    body: input,
    mock: () => {
      const email = input.email.trim().toLowerCase()
      if (db.users.some((u) => u.email === email)) {
        throw new ApiError('邮箱已存在')
      }
      const now = nowIso()
      const user: User = {
        id: createId('usr'),
        name: input.name.trim(),
        email,
        role: input.role,
        status: input.status,
        createdAt: now,
        updatedAt: now,
      }
      db.users.unshift(user)
      return user
    },
  })
}

export function updateUser(id: string, input: UserInput): Promise<User> {
  return apiRequest({
    path: `/users/${id}`,
    method: 'PUT',
    body: input,
    mock: () => {
      const index = db.users.findIndex((u) => u.id === id)
      if (index < 0) throw new ApiError('成员不存在', 404)
      const email = input.email.trim().toLowerCase()
      if (db.users.some((u) => u.email === email && u.id !== id)) {
        throw new ApiError('邮箱已存在')
      }
      const current = db.users[index]
      const next: User = {
        ...current,
        name: input.name.trim(),
        email,
        role: input.role,
        status: input.status,
        updatedAt: nowIso(),
      }
      db.users[index] = next
      return next
    },
  })
}

export function deleteUser(id: string): Promise<void> {
  return apiRequest({
    path: `/users/${id}`,
    method: 'DELETE',
    mock: () => {
      const index = db.users.findIndex((u) => u.id === id)
      if (index < 0) throw new ApiError('成员不存在', 404)
      db.users.splice(index, 1)
    },
  })
}
