const API_BASE = 'https://6aa6bca3d7765db9850791e4.mockapi.io'

export type ApiRecord = Record<string, unknown> & { id: string }

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const respuesta = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })

  if (!respuesta.ok) {
    throw new Error(`La API respondió ${respuesta.status} en ${path}`)
  }

  return respuesta.json() as Promise<T>
}

export function listarRecurso(recurso: string) {
  return request<ApiRecord[]>(`/${recurso}`)
}

export function crearRecurso(recurso: string, datos: Record<string, unknown>) {
  return request<ApiRecord>(`/${recurso}`, {
    method: 'POST',
    body: JSON.stringify(datos),
  })
}

export function actualizarRecurso(
  recurso: string,
  id: string,
  datos: Record<string, unknown>,
) {
  return request<ApiRecord>(`/${recurso}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(datos),
  })
}

export function asString(valor: unknown): string {
  if (valor == null) return ''
  if (Array.isArray(valor)) return valor.join(', ')
  return String(valor)
}

export function asBoolean(valor: unknown): boolean {
  return valor === true || valor === 'true'
}

export function asMoney(valor: unknown) {
  const numero = Number(valor)
  if (Number.isNaN(numero)) return asString(valor)
  return `$ ${numero.toLocaleString('es-CO')}`
}
