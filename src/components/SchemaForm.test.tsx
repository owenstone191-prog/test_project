import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SchemaForm } from './SchemaForm'

describe('SchemaForm', () => {
  it('validates required fields and submits values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()

    render(
      <SchemaForm
        fields={[
          { name: 'name', label: '姓名', type: 'text', required: true },
          {
            name: 'role',
            label: '角色',
            type: 'select',
            required: true,
            options: [{ label: '成员', value: 'member' }],
          },
        ]}
        onSubmit={onSubmit}
      />,
    )

    await user.click(screen.getByRole('button', { name: '保存' }))
    expect(screen.getByText('姓名不能为空')).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()

    await user.type(screen.getByLabelText(/姓名/), '林晓')
    await user.selectOptions(screen.getByLabelText(/角色/), 'member')
    await user.click(screen.getByRole('button', { name: '保存' }))

    expect(onSubmit).toHaveBeenCalledWith({ name: '林晓', role: 'member' })
  })
})
