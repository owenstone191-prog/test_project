import { useCallback, useEffect, useState } from 'react'
import type { CrudMessages, PageResult } from '../types/common'
import { ApiError } from '../api/client'
import { toast } from '../utils/toast'

interface UseCrudOptions<T, Q, I> {
  list: (query: Q) => Promise<PageResult<T>>
  create: (input: I) => Promise<T>
  update: (id: string, input: I) => Promise<T>
  remove: (id: string) => Promise<void>
  initialQuery: Q
  messages?: CrudMessages
}

export function useCrud<T, Q extends { page?: number; pageSize?: number }, I>(
  options: UseCrudOptions<T, Q, I>,
) {
  const { list, create, update, remove, initialQuery, messages } = options
  const [query, setQuery] = useState<Q>(initialQuery)
  const [data, setData] = useState<T[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(
    async (nextQuery: Q, opts?: { silent?: boolean }) => {
      if (!opts?.silent) setLoading(true)
      try {
        const result = await list(nextQuery)
        setData(result.list)
        setTotal(result.total)
        setQuery(nextQuery)
      } catch (error) {
        const message = error instanceof ApiError ? error.message : '加载失败'
        toast(message, 'error')
      } finally {
        setLoading(false)
      }
    },
    [list],
  )

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const result = await list(initialQuery)
        if (cancelled) return
        setData(result.list)
        setTotal(result.total)
        setQuery(initialQuery)
      } catch (error) {
        if (cancelled) return
        const message = error instanceof ApiError ? error.message : '加载失败'
        toast(message, 'error')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [list, initialQuery])

  const refresh = useCallback(async () => {
    await load(query, { silent: true })
  }, [load, query])

  const search = useCallback(
    (patch: Partial<Q>) => {
      void load({ ...query, ...patch, page: 1 } as Q)
    },
    [load, query],
  )

  const changePage = useCallback(
    (page: number) => {
      void load({ ...query, page } as Q)
    },
    [load, query],
  )

  const createItem = useCallback(
    async (input: I) => {
      setSubmitting(true)
      try {
        await create(input)
        toast(messages?.createSuccess ?? '创建成功', 'success')
        await load({ ...query, page: 1 } as Q)
        return true
      } catch (error) {
        const message = error instanceof ApiError ? error.message : '创建失败'
        toast(message, 'error')
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [create, load, messages, query],
  )

  const updateItem = useCallback(
    async (id: string, input: I) => {
      setSubmitting(true)
      try {
        await update(id, input)
        toast(messages?.updateSuccess ?? '更新成功', 'success')
        await load(query, { silent: true })
        return true
      } catch (error) {
        const message = error instanceof ApiError ? error.message : '更新失败'
        toast(message, 'error')
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [load, messages, query, update],
  )

  const deleteItem = useCallback(
    async (id: string) => {
      const confirmText = messages?.deleteConfirm ?? '确认删除该记录？'
      if (!window.confirm(confirmText)) return false
      setSubmitting(true)
      try {
        await remove(id)
        toast(messages?.deleteSuccess ?? '删除成功', 'success')
        await load(query, { silent: true })
        return true
      } catch (error) {
        const message = error instanceof ApiError ? error.message : '删除失败'
        toast(message, 'error')
        return false
      } finally {
        setSubmitting(false)
      }
    },
    [load, messages, query, remove],
  )

  return {
    query,
    setQuery,
    data,
    total,
    loading,
    submitting,
    refresh,
    search,
    changePage,
    createItem,
    updateItem,
    deleteItem,
  }
}
