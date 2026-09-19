import { useEffect, useState } from 'react'
import {
  actualizarRecurso,
  crearRecurso,
  listarRecurso,
  type ApiRecord,
} from '../api/http'
import { Banner } from '../components/Banner'
import { ProductCard } from '../components/ProductCard'
import { ResourceForm } from '../components/ResourceForm'
import { ResourceTable } from '../components/ResourceTable'
import type { ResourceConfig } from '../config/resources'

interface ResourcePageProps {
  resource: ResourceConfig
}

export function ResourcePage({ resource }: ResourcePageProps) {
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
        listarRecurso(resource.path),
        listarRecurso('categoria'),
        listarRecurso('cliente'),
        listarRecurso('estado_orden'),
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
  }, [resource.id])

  const abrirCrear = () => {
    setEditando(null)
    setMostrarFormulario(true)
    setMensaje('')
  }

  const abrirEditar = (registro: ApiRecord) => {
    setEditando(registro)
    setMostrarFormulario(true)
    setMensaje('')
  }

  const guardar = async (datos: Record<string, unknown>) => {
    setEnviando(true)
    setError('')
    try {
      if (editando) {
        await actualizarRecurso(resource.path, editando.id, datos)
        setMensaje(`El registro se actualizó en el Mock API.`)
      } else {
        await crearRecurso(resource.path, datos)
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

  return (
    <>
      <Banner
        eyebrow="Gestión en vivo"
        title={resource.label}
        subtitle={resource.description}
      />

      <section className="toolbar">
        <p>
          {registros.length} {registros.length === 1 ? 'registro' : 'registros'}{' '}
          en la API
        </p>
        <button type="button" onClick={abrirCrear}>
          {resource.createLabel}
        </button>
      </section>

      {mensaje && <p className="status is-ok">{mensaje}</p>}
      {error && <p className="status is-error">{error}</p>}
      {cargando && <p className="status">Consultando el Mock API...</p>}

      {mostrarFormulario && (
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
        <p className="status">Aún no hay registros. Crea el primero.</p>
      )}

      {resource.layout === 'cards' ? (
        <div className="product-grid">
          {registros.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onEditar={abrirEditar}
            />
          ))}
        </div>
      ) : (
        registros.length > 0 && (
          <ResourceTable
            resource={resource}
            registros={registros}
            onEditar={abrirEditar}
          />
        )
      )}
    </>
  )
}
