import { useMemo, useState } from 'react'
import { createProject, deleteProject, listProjects, updateProject } from '../../api/projects'
import { Modal } from '../../components/Modal'
import { ProTable } from '../../components/ProTable'
import { SchemaForm, type FormValues } from '../../components/SchemaForm'
import { StatusBadge } from '../../components/StatusBadge'
import { useCrud } from '../../hooks/useCrud'
import type { FilterField, FormFieldConfig, TableColumn } from '../../types/common'
import { formatDateTime } from '../../utils/format'
import {
  PROJECT_ENV_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  type Project,
  type ProjectEnv,
  type ProjectInput,
  type ProjectQuery,
  type ProjectStatus,
} from './types'

const envTone: Record<ProjectEnv, 'neutral' | 'warning' | 'danger'> = {
  dev: 'neutral',
  staging: 'warning',
  prod: 'danger',
}

const statusTone: Record<ProjectStatus, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  paused: 'warning',
  archived: 'neutral',
}

const envLabel = Object.fromEntries(PROJECT_ENV_OPTIONS.map((o) => [o.value, o.label])) as Record<
  ProjectEnv,
  string
>
const statusLabel = Object.fromEntries(
  PROJECT_STATUS_OPTIONS.map((o) => [o.value, o.label]),
) as Record<ProjectStatus, string>

const formFields: FormFieldConfig[] = [
  { name: 'name', label: '项目名称', type: 'text', required: true, placeholder: '例如 计费中台' },
  { name: 'code', label: '项目编码', type: 'text', required: true, placeholder: 'billing-core' },
  {
    name: 'env',
    label: '环境',
    type: 'select',
    required: true,
    options: [...PROJECT_ENV_OPTIONS],
  },
  {
    name: 'status',
    label: '状态',
    type: 'select',
    required: true,
    options: [...PROJECT_STATUS_OPTIONS],
  },
  { name: 'owner', label: '负责人', type: 'text', required: true, placeholder: '姓名' },
  {
    name: 'description',
    label: '描述',
    type: 'textarea',
    required: true,
    placeholder: '一句话说明项目用途',
  },
]

function toInput(values: FormValues): ProjectInput {
  return {
    name: String(values.name ?? ''),
    code: String(values.code ?? ''),
    env: String(values.env ?? 'dev') as ProjectEnv,
    status: String(values.status ?? 'active') as ProjectStatus,
    owner: String(values.owner ?? ''),
    description: String(values.description ?? ''),
  }
}

const INITIAL_QUERY: ProjectQuery = {
  page: 1,
  pageSize: 8,
  keyword: '',
  env: '',
  status: '',
}

const CRUD_MESSAGES = {
  createSuccess: '项目已创建',
  updateSuccess: '项目已更新',
  deleteSuccess: '项目已删除',
  deleteConfirm: '确认删除该项目？',
}

export function ProjectsModule() {
  const crud = useCrud<Project, ProjectQuery, ProjectInput>({
    list: listProjects,
    create: createProject,
    update: updateProject,
    remove: deleteProject,
    initialQuery: INITIAL_QUERY,
    messages: CRUD_MESSAGES,
  })

  const [filters, setFilters] = useState<Record<string, string>>({
    keyword: '',
    env: '',
    status: '',
  })
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)

  const filterFields: FilterField[] = useMemo(
    () => [
      { name: 'keyword', label: '关键词', type: 'text', placeholder: '名称 / 编码 / 负责人' },
      { name: 'env', label: '环境', type: 'select', options: [...PROJECT_ENV_OPTIONS] },
      { name: 'status', label: '状态', type: 'select', options: [...PROJECT_STATUS_OPTIONS] },
    ],
    [],
  )

  const columns: TableColumn<Project>[] = useMemo(
    () => [
      { key: 'name', title: '项目', dataIndex: 'name' },
      { key: 'code', title: '编码', dataIndex: 'code' },
      {
        key: 'env',
        title: '环境',
        render: (row) => <StatusBadge label={envLabel[row.env]} tone={envTone[row.env]} />,
      },
      {
        key: 'status',
        title: '状态',
        render: (row) => (
          <StatusBadge label={statusLabel[row.status]} tone={statusTone[row.status]} />
        ),
      },
      { key: 'owner', title: '负责人', dataIndex: 'owner' },
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
            <button
              type="button"
              className="btn btn-ghost danger"
              onClick={() => void crud.deleteItem(row.id)}
            >
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
        code: editing.code,
        env: editing.env,
        status: editing.status,
        owner: editing.owner,
        description: editing.description,
      }
    : {
        name: '',
        code: '',
        env: 'dev',
        status: 'active',
        owner: '',
        description: '',
      }

  return (
    <section className="module-page">
      <header className="module-header">
        <div>
          <h1>项目管理</h1>
          <p>按环境与状态管理应用，CRUD 完全复用 ProTable / SchemaForm / useCrud。</p>
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
            env: filters.env as ProjectEnv | '',
            status: filters.status as ProjectStatus | '',
          })
        }
        toolbar={
          <button type="button" className="btn btn-primary" onClick={openCreate}>
            新建项目
          </button>
        }
      />

      <Modal
        open={modalOpen}
        title={editing ? '编辑项目' : '新建项目'}
        onClose={() => setModalOpen(false)}
        width={520}
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
