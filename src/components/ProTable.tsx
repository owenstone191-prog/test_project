import { useState, type ReactNode } from 'react'
import type { FilterField, TableColumn } from '../types/common'

interface ProTableProps<T> {
  columns: TableColumn<T>[]
  dataSource: T[]
  rowKey: (row: T) => string
  loading?: boolean
  total?: number
  page?: number
  pageSize?: number
  onPageChange?: (page: number) => void
  filters?: FilterField[]
  filterValues?: Record<string, string>
  onFilterChange?: (values: Record<string, string>) => void
  onSearch?: () => void
  toolbar?: ReactNode
  emptyText?: string
}

export function ProTable<T>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  onSearch,
  toolbar,
  emptyText = '暂无数据',
}: ProTableProps<T>) {
  const [draft, setDraft] = useState<Record<string, string>>(filterValues)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const syncDraft = (name: string, value: string) => {
    const next = { ...draft, [name]: value }
    setDraft(next)
    onFilterChange?.(next)
  }

  return (
    <div className="pro-table">
      {(filters.length > 0 || toolbar) && (
        <div className="pro-table__toolbar">
          <div className="pro-table__filters">
            {filters.map((field) =>
              field.type === 'select' ? (
                <label key={field.name} className="filter-item">
                  <span>{field.label}</span>
                  <select
                    className="input"
                    value={draft[field.name] ?? ''}
                    onChange={(e) => syncDraft(field.name, e.target.value)}
                  >
                    <option value="">全部</option>
                    {(field.options ?? []).map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <label key={field.name} className="filter-item">
                  <span>{field.label}</span>
                  <input
                    className="input"
                    value={draft[field.name] ?? ''}
                    placeholder={field.placeholder}
                    onChange={(e) => syncDraft(field.name, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onSearch?.()
                    }}
                  />
                </label>
              ),
            )}
            {filters.length > 0 ? (
              <button type="button" className="btn btn-secondary" onClick={() => onSearch?.()}>
                查询
              </button>
            ) : null}
          </div>
          <div className="pro-table__actions">{toolbar}</div>
        </div>
      )}

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="table-state">
                  加载中…
                </td>
              </tr>
            ) : dataSource.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="table-state">
                  {emptyText}
                </td>
              </tr>
            ) : (
              dataSource.map((row) => (
                <tr key={rowKey(row)}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.render
                        ? col.render(row)
                        : col.dataIndex
                          ? String(row[col.dataIndex] ?? '')
                          : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pro-table__pager">
        <span>
          共 {total} 条 · 第 {page}/{totalPages} 页
        </span>
        <div className="pager-btns">
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange?.(page - 1)}
          >
            上一页
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            disabled={page >= totalPages || loading}
            onClick={() => onPageChange?.(page + 1)}
          >
            下一页
          </button>
        </div>
      </div>
    </div>
  )
}
