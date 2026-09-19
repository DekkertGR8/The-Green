import { actualizar, crear, eliminar, listar } from './resource.service'

const RECURSO = 'usuario'

export const listarUsuarios = () => listar(RECURSO)
export const crearUsuario = (datos: Record<string, unknown>) => crear(RECURSO, datos)
export const actualizarUsuario = (id: string, datos: Record<string, unknown>) => actualizar(RECURSO, id, datos)
export const eliminarUsuario = (id: string) => eliminar(RECURSO, id)