import {
  actualizarRecurso,
  crearRecurso,
  eliminarRecurso,
  listarRecurso,
  type ApiRecord,
} from '../api/http'

export function listar(recurso: string) {
  return listarRecurso(recurso)
}

export function crear(recurso: string, datos: Record<string, unknown>) {
  return crearRecurso(recurso, datos)
}

export function actualizar(
  recurso: string,
  id: string,
  datos: Record<string, unknown>,
) {
  return actualizarRecurso(recurso, id, datos)
}

export function eliminar(recurso: string, id: string) {
  return eliminarRecurso(recurso, id)
}

export type { ApiRecord }