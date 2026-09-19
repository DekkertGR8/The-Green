import { useEffect, useState } from 'react'
import type { ApiRecord } from '../api/http'
import { Banner } from '../components/Banner'
import { ProductCard } from '../components/ProductCard'
import { ResourceForm } from '../components/ResourceForm'
import { ResourceTable } from '../components/ResourceTable'
import type { ResourceConfig } from '../config/resources'
import {
  actualizar,
  crear,
  eliminar,
  listar,
} from '../services/resource.service'

interface ResourcePageProps {
  resource: ResourceConfig
  onAgregar?: (producto: ApiRecord) => void
  puedeGestionar: boolean
}

export function ResourcePage({
  resource,
  onAgregar,
  puedeGestionar,
}: ResourcePageProps) {
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

  const cargar = async () => {
    setCargando(true)
    setError('')
    try {
      const [lista, categorias, clientes, estados] = await Promise.all([
        listar(resource.path),
        listar('categoria'),
        puedeGestionar ? listar('cliente') : Promise.resolve([]),
        puedeGestionar ? listar('estado_orden') : Promise.resolve([]),
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
  }

  useEffect(() => {
    setMostrarFormulario(false)
    setEditando(null)
    setMensaje('')
    void cargar()
  }, [resource.id, puedeGestionar])

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

  const guardar = async (datos: Record<string, unknown>) => {
    if (!puedeGestionar) return
    setEnviando(true)
    setError('')
    try {
      if (editando) {
        await actualizar(resource.path, editando.id, datos)
        setMensaje(`El registro se actualizó en el Mock API.`)
      } else {
        await crear(resource.path, datos)
        setMensaje(`El registro se creó en el Mock API.`)
      }
      setMostrarFormulario(false)
      setEditando(null)
      await cargar()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo guardar el registro.',
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
      if (editando?.id === registro.id) {
        setMostrarFormulario(false)
        setEditando(null)
      }
      await cargar()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'No se pudo eliminar el registro.',
      )
    }
  }

  return (
    <>
      <Banner
        eyebrow={puedeGestionar ? 'Gestión en vivo' : 'Carta pública'}
        title={resource.label}
        subtitle={
          puedeGestionar
            ? resource.description
            : 'Consulta la carta. Crear, editar o eliminar queda reservado al personal.'
        }
      />

      <section className="toolbar">
        <p>
          {registros.length} {registros.length === 1 ? 'registro' : 'registros'}{' '}
          en la API
        </p>
        {puedeGestionar && (
          <button type="button" onClick={abrirCrear}>
            {resource.createLabel}
          </button>
        )}
      </section>

      {mensaje && <p className="status is-ok">{mensaje}</p>}
      {error && <p className="status is-error">{error}</p>}
      {cargando && <p className="status">Consultando el Mock API...</p>}

      {mostrarFormulario && puedeGestionar && (
        <section className="panel form-panel">
          <h2>
            {editando
              ? `Actualizar ${resource.singular}`
              : `Registrar ${resource.singular}`}
          </h2>
          <ResourceForm
            resource={resource}
            initial={editando}
            related={related}
            submitting={enviando}
            onSubmit={guardar}
            onCancel={() => {
              setMostrarFormulario(false)
              setEditando(null)
            }}
          />
        </section>
      )}

      {!cargando && registros.length === 0 && (
        <p className="status">
          {puedeGestionar
            ? 'Aún no hay registros. Crea el primero.'
            : 'Aún no hay registros en esta carta.'}
        </p>
      )}

      {resource.layout === 'cards' ? (
        <div className="product-grid">
          {registros.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onEditar={puedeGestionar ? abrirEditar : undefined}
              onEliminar={puedeGestionar ? borrar : undefined}
              onAgregar={onAgregar}
            />
          ))}
        </div>
      ) : (
        registros.length > 0 && (
          <ResourceTable
            resource={resource}
            registros={registros}
            onEditar={abrirEditar}
            onEliminar={borrar}
            puedeGestionar={puedeGestionar}
          />
        )
      )}
    </>
  )
}
