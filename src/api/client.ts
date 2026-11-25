import { getApiBaseUrl, getApiMode } from './config'

const MOCK_DELAY_MS = 280

export class ApiError extends Error {
  status: number

  constructor(message: string, status = 400) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/** Artificial latency so UI loading states are visible during Mock collaboration. */
export async function mockRequest<T>(factory: () => T | Promise<T>): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS))
  return factory()
}

export function paginate<T>(
  items: T[],
  page = 1,
  pageSize = 10,
): { list: T[]; total: number; page: number; pageSize: number } {
  const safePage = Math.max(1, page)
  const safeSize = Math.max(1, pageSize)
  const start = (safePage - 1) * safeSize
  return {
    list: items.slice(start, start + safeSize),
    total: items.length,
    page: safePage,
    pageSize: safeSize,
  }
}

type QueryValue = string | number | boolean | undefined | null

export interface ApiRequestOptions<T> {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  query?: Record<string, QueryValue>
  body?: unknown
  /** Mock branch — used when `VITE_API_MODE` is not `http`. */
  mock: () => T | Promise<T>
}

function buildUrl(path: string, query?: Record<string, QueryValue>): string {
  const url = new URL(`${getApiBaseUrl()}${path}`, window.location.origin)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value === undefined || value === null || value === '') continue
      url.searchParams.set(key, String(value))
    }
  }
  return url.toString()
}

async function httpRequest<T>(options: ApiRequestOptions<T>): Promise<T> {
  const method = options.method ?? 'GET'
  const response = await fetch(buildUrl(options.path, options.query), {
    method,
    headers: options.body ? { 'Content-Type': 'application/json' } : undefined,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  })

  if (!response.ok) {
    let message = `请求失败 (${response.status})`
    try {
      const payload = (await response.json()) as { message?: string }
      if (payload.message) message = payload.message
    } catch {
      // keep default message
    }
    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

/**
 * Single switch point for Mock vs HTTP.
 * Modules keep calling domain services; transport is decided here.
 */
export async function apiRequest<T>(options: ApiRequestOptions<T>): Promise<T> {
  if (getApiMode() === 'http') {
    return httpRequest(options)
  }
  return mockRequest(options.mock)
}
