import { beforeEach, describe, expect, it } from 'vitest'
import { createProject, deleteProject, listProjects, updateProject } from './projects'
import { resetStore } from './mock/store'

describe('projects api', () => {
  beforeEach(() => {
    resetStore()
  })

  it('filters by env and status', async () => {
    const page = await listProjects({ env: 'prod', status: 'active' })
    expect(page.list.every((item) => item.env === 'prod' && item.status === 'active')).toBe(true)
    expect(page.total).toBeGreaterThan(0)
  })

  it('supports full crud lifecycle', async () => {
    const created = await createProject({
      name: '实验服务',
      code: 'exp-svc',
      env: 'dev',
      status: 'active',
      owner: 'Talula',
      description: '临时实验',
    })
    expect(created.code).toBe('exp-svc')

    const updated = await updateProject(created.id, {
      name: '实验服务 v2',
      code: 'exp-svc',
      env: 'staging',
      status: 'paused',
      owner: 'Talula',
      description: '暂停中',
    })
    expect(updated.env).toBe('staging')
    expect(updated.status).toBe('paused')

    await deleteProject(created.id)
    const after = await listProjects({ keyword: 'exp-svc' })
    expect(after.total).toBe(0)
  })
})
