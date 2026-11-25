import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { useCrud } from './useCrud'

interface Item {
  id: string
  name: string
}

interface Query {
  page?: number
  pageSize?: number
  keyword?: string
}

interface Input {
  name: string
}

const INITIAL_QUERY: Query = { page: 1, pageSize: 10, keyword: '' }

function Harness({
  list,
  create,
  update,
  remove,
}: {
  list: (query: Query) => Promise<{ list: Item[]; total: number; page: number; pageSize: number }>
  create: (input: Input) => Promise<Item>
  update: (id: string, input: Input) => Promise<Item>
  remove: (id: string) => Promise<void>
}) {
  const crud = useCrud<Item, Query, Input>({
    list,
    create,
    update,
    remove,
    initialQuery: INITIAL_QUERY,
  })

  return (
    <div>
      <div data-testid="loading">{String(crud.loading)}</div>
      <div data-testid="total">{crud.total}</div>
      <ul>
        {crud.data.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button type="button" onClick={() => crud.search({ keyword: 'b' })}>
        search
      </button>
      <button type="button" onClick={() => crud.changePage(2)}>
        page2
      </button>
      <button
        type="button"
        onClick={() => {
          void crud.createItem({ name: 'new' })
        }}
      >
        create
      </button>
    </div>
  )
}

describe('useCrud', () => {
  it('loads list, searches, pages, and creates', async () => {
    const user = userEvent.setup()
    const list = vi
      .fn()
      .mockResolvedValueOnce({
        list: [{ id: '1', name: 'alpha' }],
        total: 1,
        page: 1,
        pageSize: 10,
      })
      .mockResolvedValueOnce({
        list: [{ id: '2', name: 'beta' }],
        total: 1,
        page: 1,
        pageSize: 10,
      })
      .mockResolvedValueOnce({
        list: [{ id: '2', name: 'beta' }],
        total: 12,
        page: 2,
        pageSize: 10,
      })
      .mockResolvedValueOnce({
        list: [{ id: '3', name: 'new' }],
        total: 2,
        page: 1,
        pageSize: 10,
      })

    const create = vi.fn().mockResolvedValue({ id: '3', name: 'new' })
    const update = vi.fn()
    const remove = vi.fn()

    render(<Harness list={list} create={create} update={update} remove={remove} />)

    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'))
    expect(screen.getByText('alpha')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'search' }))
    await waitFor(() => expect(screen.getByText('beta')).toBeInTheDocument())
    expect(list).toHaveBeenCalledWith({ page: 1, pageSize: 10, keyword: 'b' })

    await user.click(screen.getByRole('button', { name: 'page2' }))
    await waitFor(() => expect(screen.getByTestId('total')).toHaveTextContent('12'))
    expect(list).toHaveBeenCalledWith({ page: 2, pageSize: 10, keyword: 'b' })

    await user.click(screen.getByRole('button', { name: 'create' }))
    await waitFor(() => expect(create).toHaveBeenCalledWith({ name: 'new' }))
    await waitFor(() => expect(screen.getByText('new')).toBeInTheDocument())
  })
})
