import type { ReactNode } from 'react'

export interface PageQuery {
  page?: number
  pageSize?: number
  keyword?: string
}

export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export type FieldType = 'text' | 'select' | 'textarea' | 'switch'

export interface SelectOption {
  label: string
  value: string
}

export interface FormFieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  required?: boolean
  options?: SelectOption[]
  disabled?: boolean
}

export interface TableColumn<T> {
  key: string
  title: string
  width?: string | number
  render?: (row: T) => ReactNode
  dataIndex?: keyof T & string
}

export interface FilterField {
  name: string
  label: string
  type: 'text' | 'select'
  placeholder?: string
  options?: SelectOption[]
}

export interface CrudMessages {
  createSuccess?: string
  updateSuccess?: string
  deleteSuccess?: string
  deleteConfirm?: string
}
