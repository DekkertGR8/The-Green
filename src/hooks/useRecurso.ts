import { useCallback, useEffect, useState } from 'react'
import type { ApiRecord } from '../api/http'
import type { ResourceConfig } from '../config/resources'
import {
  actualizar,
  crear,
  eliminar,
  listar,
} from '../services/resource.service'

export function useRecurso(resource: ResourceConfig, puedeGestionar: boolean) {
  const [registros, setRegistros] = useState<ApiRecord[]>([])
  const [related, setRelated] = useState<Record<string, ApiRecord[]>>({
    categoria: [],
    cliente: [],
    estado_orden: [],
  })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [editando, setEditando] = useState<ApiRecord | null>(null)
  const [enviando, setEnviando] = useState(false)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError('')
    try {
      const necesitaCliente = resource.fields.some((campo) => campo.optionsFrom === 'cliente')
      const necesitaEstado = resource.fields.some((campo) => campo.optionsFrom === 'estado_orden')
      const necesitaCategoria =
        resource.path === 'producto' ||
        resource.fields.some((campo) => campo.optionsFrom === 'categoria')

      const [lista, categorias, clientes, estados] = await Promise.all([
        listar(resource.path),
        necesitaCategoria ? listar('categoria') : Promise.resolve([]),
        puedeGestionar && necesitaCliente ? listar('cliente') : Promise.resolve([]),
        puedeGestionar && necesitaEstado ? listar('estado_orden') : Promise.resolve([]),
      ])
      setRegistros(lista)
      setRelated({
        categoria: categorias,
        cliente: clientes,
        estado_orden: estados,
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudieron cargar los registros.',
      )
    } finally {
      setCargando(false)
    }
  }, [puedeGestionar, resource.fields, resource.path])

  useEffect(() => {
    setMostrarFormulario(false)
    setEditando(null)
    setMensaje('')
    void cargar()
  }, [cargar, resource.id])

  const abrirCrear = () => {
    if (!puedeGestionar) return
    setEditando(null)
    setMostrarFormulario(true)
    setMensaje('')
  }

  const abrirEditar = (registro: ApiRecord) => {
    if (!puedeGestionar) return
    setEditando(registro)
    setMostrarFormulario(true)
    setMensaje('')
  }

  const cerrarFormulario = () => {
    setMostrarFormulario(false)
    setEditando(null)
  }

  const guardar = async (
    datos: Record<string, unknown>,
    transformar?: (datos: Record<string, unknown>) => Record<string, unknown>,
  ) => {
    if (!puedeGestionar) return
    setEnviando(true)
    setError('')
    try {
      const payload = transformar ? transformar(datos) : datos
      if (editando) {
        await actualizar(resource.path, editando.id, payload)
        setMensaje('El registro se actualizó en el Mock API.')
      } else {
        await crear(resource.path, payload)
        setMensaje('El registro se creó en el Mock API.')
      }
      cerrarFormulario()
      await cargar()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'No se pudo guardar el registro.',
      )
    } finally {
      setEnviando(false)
    }
  }

  const borrar = async (registro: ApiRecord) => {
    if (!puedeGestionar) return
    const ok = window.confirm(`¿Eliminar este ${resource.singular}?`)
    if (!ok) return
    setError('')
    try {
      await eliminar(resource.path, registro.id)
      setMensaje('El registro se eliminó en el Mock API.')
      if (editando?.id === registro.id) cerrarFormulario()
      await cargar()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el registro.',
      )
    }
  }

  return {
    registros,
    related,
    cargando,
    error,
    mensaje,
    mostrarFormulario,
    editando,
    enviando,
    abrirCrear,
    abrirEditar,
    cerrarFormulario,
    guardar,
    borrar,
  }
}
