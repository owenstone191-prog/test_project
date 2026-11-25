import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ProTable } from './ProTable'

interface Row {
  id: string
  name: string
}

describe('ProTable', () => {
  it('renders rows and triggers search / page change', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    const onPageChange = vi.fn()
    const onFilterChange = vi.fn()

    render(
      <ProTable<Row>
        columns={[
          { key: 'name', title: '名称', dataIndex: 'name' },
          {
            key: 'actions',
            title: '操作',
            render: (row) => <span>{row.id}</span>,
          },
        ]}
        dataSource={[
          { id: '1', name: '计费中台' },
          { id: '2', name: '通知网关' },
        ]}
        rowKey={(row) => row.id}
        total={20}
        page={1}
        pageSize={10}
        filters={[{ name: 'keyword', label: '关键词', type: 'text', placeholder: '搜索' }]}
        filterValues={{ keyword: '' }}
        onFilterChange={onFilterChange}
        onSearch={onSearch}
        onPageChange={onPageChange}
      />,
    )

    expect(screen.getByText('计费中台')).toBeInTheDocument()
    expect(screen.getByText('通知网关')).toBeInTheDocument()

    await user.type(screen.getByPlaceholderText('搜索'), '计费')
    expect(onFilterChange).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: '查询' }))
    expect(onSearch).toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: '下一页' }))
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('shows empty state', () => {
    render(
      <ProTable<Row>
        columns={[{ key: 'name', title: '名称', dataIndex: 'name' }]}
        dataSource={[]}
        rowKey={(row) => row.id}
        emptyText="没有项目"
      />,
    )
    expect(screen.getByText('没有项目')).toBeInTheDocument()
  })
})
