import { beforeEach, describe, expect, it } from 'vitest'
import { createUser, deleteUser, listUsers, updateUser } from './users'
import { resetStore } from './mock/store'

describe('users api', () => {
  beforeEach(() => {
    resetStore()
  })

  it('lists and filters by keyword and role', async () => {
    const page = await listUsers({ keyword: 'chen', role: 'admin', page: 1, pageSize: 10 })
    expect(page.total).toBe(1)
    expect(page.list[0]?.email).toBe('chenke@ops.local')
  })

  it('creates updates and deletes a user', async () => {
    const created = await createUser({
      name: '测试员',
      email: 'tester@ops.local',
      role: 'member',
      status: 'invited',
    })
    expect(created.id).toMatch(/^usr_/)

    const updated = await updateUser(created.id, {
      name: '测试员改',
      email: 'tester@ops.local',
      role: 'viewer',
      status: 'active',
    })
    expect(updated.name).toBe('测试员改')
    expect(updated.role).toBe('viewer')

    await deleteUser(created.id)
    const after = await listUsers({ keyword: 'tester@ops.local' })
    expect(after.total).toBe(0)
  })

  it('rejects duplicate email', async () => {
    await expect(
      createUser({
        name: '重复',
        email: 'chenke@ops.local',
        role: 'member',
        status: 'active',
      }),
    ).rejects.toThrow('邮箱已存在')
  })
})
