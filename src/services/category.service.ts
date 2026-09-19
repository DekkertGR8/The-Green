import { actualizar, crear, eliminar, listar } from './resource.service'

const RECURSO = 'categoria'

export const listarCategorias = () => listar(RECURSO)
export const crearCategoria = (datos: Record<string, unknown>) => crear(RECURSO, datos)
export const actualizarCategoria = (id: string, datos: Record<string, unknown>) => actualizar(RECURSO, id, datos)
export const eliminarCategoria = (id: string) => eliminar(RECURSO, id)