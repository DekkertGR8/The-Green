import type { Sesion } from './sesion'

export const ROL_ADMIN = 'administrador'
export const ROL_CLIENTE = 'cliente'

export const ROLES_EMPLEADO = [
  'chef',
  'bartender',
  'barista',
  'cajero',
  'mesero',
] as const

export const ROLES_PERSONAL = [ROL_ADMIN, ...ROLES_EMPLEADO] as const

export type RolEmpleado = (typeof ROLES_EMPLEADO)[number]
export type AccesoVista = 'publico' | 'empleado' | 'admin'

export function normalizarRol(rol: string | undefined) {
  return (rol ?? '').trim().toLowerCase()
}

export function esAdmin(sesion: Sesion | null): boolean {
  return Boolean(sesion && normalizarRol(sesion.rol) === ROL_ADMIN)
}

export function esEmpleado(sesion: Sesion | null): boolean {
  return Boolean(
    sesion && ROLES_EMPLEADO.includes(normalizarRol(sesion.rol) as RolEmpleado),
  )
}

export function esPersonal(sesion: Sesion | null): boolean {
  return esAdmin(sesion) || esEmpleado(sesion)
}

export function etiquetaRol(sesion: Sesion | null) {
  if (esAdmin(sesion)) return 'admin'
  if (esEmpleado(sesion)) return 'personal'
  return ''
}

export function puedeVerVista(acceso: AccesoVista, sesion: Sesion | null) {
  if (acceso === 'publico') return true
  if (acceso === 'admin') return esAdmin(sesion)
  return esPersonal(sesion)
}

export function puedeGestionarRecurso(
  recurso: string,
  sesion: Sesion | null,
): boolean {
  if (recurso === 'usuario' || recurso === 'categoria' || recurso === 'estado_orden') {
    return esAdmin(sesion)
  }
  if (recurso === 'cliente' || recurso === 'orden' || recurso === 'producto') {
    return esPersonal(sesion)
  }
  return false
}

export function esRolPersonalValido(rol: string) {
  return ROLES_PERSONAL.includes(normalizarRol(rol) as (typeof ROLES_PERSONAL)[number])
}
