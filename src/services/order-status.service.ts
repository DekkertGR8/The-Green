import { actualizar, crear, listar } from './resource.service'

const RECURSO = 'estado_orden'

export const listarEstadosOrden = () => listar(RECURSO)
export const crearEstadoOrden = (datos: Record<string, unknown>) => crear(RECURSO, datos)
export const actualizarEstadoOrden = (id: string, datos: Record<string, unknown>) => actualizar(RECURSO, id, datos)