import { afterEach, describe, expect, it, vi } from 'vitest'
import { apiRequest, paginate } from './client'

describe('paginate', () => {
  it('slices items by page and pageSize', () => {
    const items = [1, 2, 3, 4, 5]
    expect(paginate(items, 1, 2)).toEqual({
      list: [1, 2],
      total: 5,
      page: 1,
      pageSize: 2,
    })
    expect(paginate(items, 3, 2)).toEqual({
      list: [5],
      total: 5,
      page: 3,
      pageSize: 2,
    })
  })

  it('guards invalid page values', () => {
    const result = paginate(['a', 'b'], 0, 0)
    expect(result.page).toBe(1)
    expect(result.pageSize).toBe(1)
    expect(result.list).toEqual(['a'])
  })
})

describe('apiRequest', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
  })

  it('uses mock branch by default', async () => {
    vi.stubEnv('VITE_API_MODE', 'mock')
    const mock = vi.fn().mockReturnValue({ ok: true })
    const result = await apiRequest({
      path: '/demo',
      mock,
    })
    expect(result).toEqual({ ok: true })
    expect(mock).toHaveBeenCalledTimes(1)
  })

  it('uses fetch when mode is http', async () => {
    vi.stubEnv('VITE_API_MODE', 'http')
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 'http-1' }),
    })
    vi.stubGlobal('fetch', fetchMock)

    const result = await apiRequest({
      path: '/users',
      method: 'GET',
      query: { page: 1 },
      mock: () => ({ id: 'mock-1' }),
    })

    expect(result).toEqual({ id: 'http-1' })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(String(fetchMock.mock.calls[0]?.[0])).toContain('/api/users')
  })
})
