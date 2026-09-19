import { asString, type ApiRecord } from '../api/http'

const KEY = 'the-green-sesion'

export interface Sesion {
  id: string
  nombre: string
  correo: string
  rol: string
}

export function leerSesion(): Sesion | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Sesion
    if (!data.id || !data.correo) return null
    return data
  } catch {
    return null
  }
}

export function guardarSesion(sesion: Sesion) {
  localStorage.setItem(KEY, JSON.stringify(sesion))
}

export function borrarSesion() {
  localStorage.removeItem(KEY)
}

export function sesionDesdeUsuario(usuario: ApiRecord): Sesion {
  return {
    id: usuario.id,
    nombre: asString(usuario.nombre),
    correo: asString(usuario.correo).toLowerCase(),
    rol: asString(usuario.rol) || 'cliente',
  }
}
