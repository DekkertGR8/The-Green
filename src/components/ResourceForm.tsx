import { useEffect, useState, type FormEvent } from 'react'
import { asBoolean, asString, type ApiRecord } from '../api/http'
import type { FieldConfig, ResourceConfig } from '../config/resources'

interface ResourceFormProps {
  resource: ResourceConfig
  initial?: ApiRecord | null
  related: Record<string, ApiRecord[]>
  submitting: boolean
  onSubmit: (datos: Record<string, unknown>) => Promise<void>
  onCancel: () => void
}

function valorInicial(campo: FieldConfig, registro?: ApiRecord | null) {
  if (!registro) {
    if (campo.type === 'checkbox') return true
    if (campo.type === 'number') return ''
    if (campo.type === 'lines') return ''
    return ''
  }

  const valor = registro[campo.key]
  if (campo.type === 'checkbox') return asBoolean(valor)
  if (campo.type === 'lines') {
    return Array.isArray(valor) ? valor.join('\n') : asString(valor)
  }
  if (valor == null) return ''
  return valor
}

function opcionesCampo(campo: FieldConfig, related: Record<string, ApiRecord[]>) {
  if (campo.options) return campo.options
  if (!campo.optionsFrom) return []

  return related[campo.optionsFrom].map((item) => {
    if (campo.optionsFrom === 'cliente') {
      return `${asString(item.nombre)} ${asString(item.apellido)}`.trim()
    }
    return asString(item.nombre)
  }).filter(Boolean)
}

export function ResourceForm({
  resource,
  initial,
  related,
  submitting,
  onSubmit,
  onCancel,
}: ResourceFormProps) {
  const [valores, setValores] = useState<Record<string, unknown>>({})

  useEffect(() => {
    const siguiente: Record<string, unknown> = {}
    for (const campo of resource.fields) {
      siguiente[campo.key] = valorInicial(campo, initial)
    }
    setValores(siguiente)
  }, [resource, initial])

  const cambiar = (clave: string, valor: unknown) => {
    setValores((prev) => ({ ...prev, [clave]: valor }))
  }

  const handleSubmit = async (evento: FormEvent<HTMLFormElement>) => {
    evento.preventDefault()
    const payload: Record<string, unknown> = {}

    for (const campo of resource.fields) {
      const valor = valores[campo.key]
      if (campo.type === 'checkbox') {
        payload[campo.key] = Boolean(valor)
      } else if (campo.type === 'number') {
        payload[campo.key] = valor === '' ? 0 : Number(valor)
      } else if (campo.type === 'lines') {
        payload[campo.key] = asString(valor)
          .split('\n')
          .map((linea) => linea.trim())
          .filter(Boolean)
      } else {
        payload[campo.key] = asString(valor).trim()
      }
    }

    await onSubmit(payload)
  }

  return (
    <form className="resource-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        {resource.fields.map((campo) => {
          const opciones = opcionesCampo(campo, related)
          const valor = valores[campo.key]

          return (
            <label
              key={campo.key}
              className={campo.type === 'textarea' || campo.type === 'lines' ? 'span-2' : ''}
            >
              <span>
                {campo.label}
                {campo.required ? ' *' : ''}
              </span>

              {campo.type === 'textarea' || campo.type === 'lines' ? (
                <textarea
                  required={campo.required}
                  placeholder={campo.placeholder}
                  value={asString(valor)}
                  rows={4}
                  onChange={(e) => cambiar(campo.key, e.target.value)}
                />
              ) : campo.type === 'select' ? (
                <select
                  required={campo.required}
                  value={asString(valor)}
                  onChange={(e) => cambiar(campo.key, e.target.value)}
                >
                  <option value="">Selecciona una opción</option>
                  {opciones.map((opcion) => (
                    <option key={opcion} value={opcion}>
                      {opcion}
                    </option>
                  ))}
                </select>
              ) : campo.type === 'checkbox' ? (
                <input
                  type="checkbox"
                  checked={Boolean(valor)}
                  onChange={(e) => cambiar(campo.key, e.target.checked)}
                />
              ) : (
                <input
                  type={campo.type}
                  required={campo.required}
                  placeholder={campo.placeholder}
                  value={asString(valor)}
                  onChange={(e) => cambiar(campo.key, e.target.value)}
                />
              )}
            </label>
          )
        })}
      </div>

      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting
            ? 'Guardando...'
            : initial
              ? `Actualizar ${resource.singular}`
              : `Registrar ${resource.singular}`}
        </button>
        <button type="button" className="ghost" onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  )
}
