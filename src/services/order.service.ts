import { actualizar, crear, eliminar, listar } from './resource.service'

const RECURSO = 'orden'

export const listarOrdenes = () => listar(RECURSO)
export const crearOrden = (datos: Record<string, unknown>) => crear(RECURSO, datos)
export const actualizarOrden = (id: string, datos: Record<string, unknown>) => actualizar(RECURSO, id, datos)
export const eliminarOrden = (id: string) => eliminar(RECURSO, id)