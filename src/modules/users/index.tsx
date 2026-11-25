import { useMemo, useState } from 'react'
import { createUser, deleteUser, listUsers, updateUser } from '../../api/users'
import { Modal } from '../../components/Modal'
import { ProTable } from '../../components/ProTable'
import { SchemaForm, type FormValues } from '../../components/SchemaForm'
import { StatusBadge } from '../../components/StatusBadge'
import { useCrud } from '../../hooks/useCrud'
import type { FilterField, FormFieldConfig, TableColumn } from '../../types/common'
import { formatDateTime } from '../../utils/format'
import {
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
  type User,
  type UserInput,
  type UserQuery,
  type UserRole,
  type UserStatus,
} from './types'

const roleTone: Record<UserRole, 'info' | 'success' | 'neutral'> = {
  admin: 'info',
  member: 'success',
  viewer: 'neutral',
}

const statusTone: Record<UserStatus, 'success' | 'warning' | 'danger'> = {
  active: 'success',
  invited: 'warning',
  disabled: 'danger',
}

const roleLabel = Object.fromEntries(USER_ROLE_OPTIONS.map((o) => [o.value, o.label])) as Record<
  UserRole,
  string
>
const statusLabel = Object.fromEntries(USER_STATUS_OPTIONS.map((o) => [o.value, o.label])) as Record<
  UserStatus,
  string
>

const formFields: FormFieldConfig[] = [
  { name: 'name', label: '姓名', type: 'text', required: true, placeholder: '成员姓名' },
  { name: 'email', label: '邮箱', type: 'text', required: true, placeholder: 'name@ops.local' },
  {
    name: 'role',
    label: '角色',
    type: 'select',
    required: true,
    options: [...USER_ROLE_OPTIONS],
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    required: true,
    options: [...USER_STATUS_OPTIONS],
  },
]

function toInput(values: FormValues): UserInput {
  return {
    name: String(values.name ?? ''),
    email: String(values.email ?? ''),
    role: String(values.role ?? 'member') as UserRole,
    status: String(values.status ?? 'invited') as UserStatus,
  }
}

const INITIAL_QUERY: UserQuery = {
  page: 1,
  pageSize: 8,
  keyword: '',
  role: '',
  status: '',
}

const CRUD_MESSAGES = {
  createSuccess: '成员已创建',
  updateSuccess: '成员已更新',
  deleteSuccess: '成员已删除',
  deleteConfirm: '确认删除该成员？',
}

export function UsersModule() {
  const crud = useCrud<User, UserQuery, UserInput>({
    list: listUsers,
    create: createUser,
    update: updateUser,
    remove: deleteUser,
    initialQuery: INITIAL_QUERY,
    messages: CRUD_MESSAGES,
  })

  const [filters, setFilters] = useState<Record<string, string>>({
    keyword: '',
    role: '',
    status: '',
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)

  const filterFields: FilterField[] = useMemo(
    () => [
      { name: 'keyword', label: '关键词', type: 'text', placeholder: '姓名 / 邮箱' },
      { name: 'role', label: '角色', type: 'select', options: [...USER_ROLE_OPTIONS] },
      { name: 'status', label: '状态', type: 'select', options: [...USER_STATUS_OPTIONS] },
    ],
    [],
  )

  const columns: TableColumn<User>[] = useMemo(
    () => [
      { key: 'name', title: '姓名', dataIndex: 'name' },
      { key: 'email', title: '邮箱', dataIndex: 'email' },
      {
        key: 'role',
        title: '角色',
        render: (row) => <StatusBadge label={roleLabel[row.role]} tone={roleTone[row.role]} />,
      },
      {
        key: 'status',
        title: '状态',
        render: (row) => (
          <StatusBadge label={statusLabel[row.status]} tone={statusTone[row.status]} />
        ),
      },
      {
        key: 'updatedAt',
        title: '更新时间',
        render: (row) => formatDateTime(row.updatedAt),
      },
      {
        key: 'actions',
        title: '操作',
        width: 160,
        render: (row) => (
          <div className="row-actions">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setEditing(row)
                setModalOpen(true)
              }}
            >
              编辑
            </button>
            <button type="button" className="btn btn-ghost danger" onClick={() => void crud.deleteItem(row.id)}>
              删除
            </button>
          </div>
        ),
      },
    ],
    [crud],
  )

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const initialValues: FormValues = editing
    ? {
        name: editing.name,
        email: editing.email,
        role: editing.role,
        status: editing.status,
      }
    : {
        name: '',
        email: '',
        role: 'member',
        status: 'invited',
      }

  return (
    <section className="module-page">
      <header className="module-header">
        <div>
          <h1>团队成员</h1>
          <p>管理成员角色、邀请状态与启停，列表与表单复用公共 CRUD 组件。</p>
        </div>
      </header>

      <ProTable
        columns={columns}
        dataSource={crud.data}
        rowKey={(row) => row.id}
        loading={crud.loading}
        total={crud.total}
        page={crud.query.page ?? 1}
        pageSize={crud.query.pageSize ?? 8}
        onPageChange={crud.changePage}
        filters={filterFields}
        filterValues={filters}
        onFilterChange={setFilters}
        onSearch={() =>
          crud.search({
            keyword: filters.keyword,
            role: filters.role as UserRole | '',
            status: filters.status as UserStatus | '',
          })
        }
        toolbar={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            新建成员
          </button>
        }
      />

      <Modal
        open={modalOpen}
        title={editing ? '编辑成员' : '新建成员'}
        onClose={() => setModalOpen(false)}
      >
        <SchemaForm
          key={editing?.id ?? 'create'}
          fields={formFields}
          initialValues={initialValues}
          submitting={crud.submitting}
          submitLabel={editing ? '保存修改' : '创建'}
          onCancel={() => setModalOpen(false)}
          onSubmit={async (values) => {
            const input = toInput(values)
            const ok = editing
              ? await crud.updateItem(editing.id, input)
              : await crud.createItem(input)
            if (ok) setModalOpen(false)
          }}
        />
      </Modal>
    </section>
  )
}
