import { actualizar, crear, listar } from './resource.service'

const RECURSO = 'producto'

export const listarProductos = () => listar(RECURSO)
export const crearProducto = (datos: Record<string, unknown>) => crear(RECURSO, datos)
export const actualizarProducto = (id: string, datos: Record<string, unknown>) => actualizar(RECURSO, id, datos)