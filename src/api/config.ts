export type ApiMode = 'mock' | 'http'

/** Default mock. Set `VITE_API_MODE=http` to hit a real backend. */
export function getApiMode(): ApiMode {
  return import.meta.env.VITE_API_MODE === 'http' ? 'http' : 'mock'
}

export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL
  return typeof base === 'string' && base.length > 0 ? base.replace(/\/$/, '') : '/api'
}
