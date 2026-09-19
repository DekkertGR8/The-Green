import { actualizar, crear, eliminar, listar } from './resource.service'

const RECURSO = 'cliente'

export const listarClientes = () => listar(RECURSO)
export const crearCliente = (datos: Record<string, unknown>) => crear(RECURSO, datos)
export const actualizarCliente = (id: string, datos: Record<string, unknown>) => actualizar(RECURSO, id, datos)
export const eliminarCliente = (id: string) => eliminar(RECURSO, id)