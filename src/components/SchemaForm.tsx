import { useState, type FormEvent } from 'react'
import type { FormFieldConfig } from '../types/common'

export type FormValues = Record<string, string | boolean>

interface SchemaFormProps {
  fields: FormFieldConfig[]
  initialValues?: FormValues
  submitLabel?: string
  submitting?: boolean
  onSubmit: (values: FormValues) => void | Promise<void>
  onCancel?: () => void
}

function defaultValues(fields: FormFieldConfig[], initial?: FormValues): FormValues {
  const values: FormValues = {}
  for (const field of fields) {
    if (initial && initial[field.name] !== undefined) {
      values[field.name] = initial[field.name]
      continue
    }
    values[field.name] = field.type === 'switch' ? false : ''
  }
  return values
}

export function SchemaForm({
  fields,
  initialValues,
  submitLabel = '保存',
  submitting = false,
  onSubmit,
  onCancel,
}: SchemaFormProps) {
  // Parent should remount with `key` when switching create/edit records.
  const [values, setValues] = useState<FormValues>(() => defaultValues(fields, initialValues))
  const [errors, setErrors] = useState<Record<string, string>>({})

  const setField = (name: string, value: string | boolean) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const validate = (): boolean => {
    const nextErrors: Record<string, string> = {}
    for (const field of fields) {
      if (!field.required) continue
      const value = values[field.name]
      if (field.type === 'switch') continue
      if (typeof value !== 'string' || !value.trim()) {
        nextErrors[field.name] = `${field.label}不能为空`
      }
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (!validate()) return
    await onSubmit(values)
  }

  return (
    <form className="schema-form" onSubmit={handleSubmit} noValidate>
      {fields.map((field) => {
        const error = errors[field.name]
        const switchOn = values[field.name] === true
        return (
          <label key={field.name} className="form-field">
            <span className="form-label">
              {field.label}
              {field.required ? <em>*</em> : null}
            </span>
            {field.type === 'text' ? (
              <input
                className="input"
                value={String(values[field.name] ?? '')}
                placeholder={field.placeholder}
                disabled={field.disabled || submitting}
                onChange={(e) => setField(field.name, e.target.value)}
              />
            ) : null}
            {field.type === 'textarea' ? (
              <textarea
                className="input textarea"
                value={String(values[field.name] ?? '')}
                placeholder={field.placeholder}
                disabled={field.disabled || submitting}
                rows={3}
                onChange={(e) => setField(field.name, e.target.value)}
              />
            ) : null}
            {field.type === 'select' ? (
              <select
                className="input"
                value={String(values[field.name] ?? '')}
                disabled={field.disabled || submitting}
                onChange={(e) => setField(field.name, e.target.value)}
              >
                <option value="">{field.placeholder ?? '请选择'}</option>
                {(field.options ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : null}
            {field.type === 'switch' ? (
              <span className="switch-row">
                <input
                  type="checkbox"
                  checked={switchOn}
                  disabled={field.disabled || submitting}
                  onChange={(e) => setField(field.name, e.target.checked)}
                />
                <span>{switchOn ? '开启' : '关闭'}</span>
              </span>
            ) : null}
            {error ? <span className="form-error">{error}</span> : null}
          </label>
        )
      })}
      <div className="form-actions">
        {onCancel ? (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={submitting}>
            取消
          </button>
        ) : null}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? '提交中…' : submitLabel}
        </button>
      </div>
    </form>
  )
}
