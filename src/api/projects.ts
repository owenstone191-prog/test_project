import type { PageResult } from '../types/common'
import type { Project, ProjectInput, ProjectQuery } from '../modules/projects/types'
import { createId, nowIso } from '../utils/format'
import { ApiError, apiRequest, paginate } from './client'
import { db } from './mock/store'

function matchProject(project: Project, query: ProjectQuery): boolean {
  const keyword = query.keyword?.trim().toLowerCase()
  if (keyword) {
    const hay = `${project.name} ${project.code} ${project.owner}`.toLowerCase()
    if (!hay.includes(keyword)) return false
  }
  if (query.env && project.env !== query.env) return false
  if (query.status && project.status !== query.status) return false
  return true
}

export function listProjects(query: ProjectQuery = {}): Promise<PageResult<Project>> {
  return apiRequest({
    path: '/projects',
    method: 'GET',
    query: {
      page: query.page,
      pageSize: query.pageSize,
      keyword: query.keyword,
      env: query.env,
      status: query.status,
    },
    mock: () => {
      const filtered = db.projects
        .filter((item) => matchProject(item, query))
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      return paginate(filtered, query.page, query.pageSize)
    },
  })
}

export function createProject(input: ProjectInput): Promise<Project> {
  return apiRequest({
    path: '/projects',
    method: 'POST',
    body: input,
    mock: () => {
      const code = input.code.trim().toLowerCase()
      if (db.projects.some((p) => p.code === code)) {
        throw new ApiError('项目编码已存在')
      }
      const now = nowIso()
      const project: Project = {
        id: createId('prj'),
        name: input.name.trim(),
        code,
        env: input.env,
        status: input.status,
        owner: input.owner.trim(),
        description: input.description.trim(),
        createdAt: now,
        updatedAt: now,
      }
      db.projects.unshift(project)
      return project
    },
  })
}

export function updateProject(id: string, input: ProjectInput): Promise<Project> {
  return apiRequest({
    path: `/projects/${id}`,
    method: 'PUT',
    body: input,
    mock: () => {
      const index = db.projects.findIndex((p) => p.id === id)
      if (index < 0) throw new ApiError('项目不存在', 404)
      const code = input.code.trim().toLowerCase()
      if (db.projects.some((p) => p.code === code && p.id !== id)) {
        throw new ApiError('项目编码已存在')
      }
      const current = db.projects[index]
      const next: Project = {
        ...current,
        name: input.name.trim(),
        code,
        env: input.env,
        status: input.status,
        owner: input.owner.trim(),
        description: input.description.trim(),
        updatedAt: nowIso(),
      }
      db.projects[index] = next
      return next
    },
  })
}

export function deleteProject(id: string): Promise<void> {
  return apiRequest({
    path: `/projects/${id}`,
    method: 'DELETE',
    mock: () => {
      const index = db.projects.findIndex((p) => p.id === id)
      if (index < 0) throw new ApiError('项目不存在', 404)
      db.projects.splice(index, 1)
    },
  })
}
