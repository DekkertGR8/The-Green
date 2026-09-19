import type { ApiRecord } from '../api/http'
import { payloadUsuarioEmpleado } from '../auth/auth.service'
import type { Sesion } from '../auth/sesion'
import { Banner } from '../components/Banner'
import { ProductCard } from '../components/ProductCard'
import { ResourceForm } from '../components/ResourceForm'
import { ResourceTable } from '../components/ResourceTable'
import type { ResourceConfig } from '../config/resources'
import { useRecurso } from '../hooks/useRecurso'

interface ResourcePageProps {
  resource: ResourceConfig
  sesion: Sesion | null
  puedeGestionar: boolean
  onAgregar?: (producto: ApiRecord) => void
}

export function ResourcePage({
  resource,
  sesion,
  puedeGestionar,
  onAgregar,
}: ResourcePageProps) {
  const {
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
  } = useRecurso(resource, puedeGestionar)

  const visibles =
    resource.id === 'producto'
      ? puedeGestionar
        ? registros
        : registros.filter((item) => item.estado !== false && item.estado !== 'false')
      : registros

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
          {visibles.length} {visibles.length === 1 ? 'registro' : 'registros'}{' '}
          {puedeGestionar ? 'en la API' : 'en la carta'}
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
          {resource.id === 'usuario' && (
            <p className="status">
              {sesion?.nombre} crea la cuenta. El empleado podrá gestionar
              clientes y órdenes al entrar.
            </p>
          )}
          <ResourceForm
            resource={resource}
            initial={editando}
            related={related}
            submitting={enviando}
            onSubmit={(datos) =>
              guardar(
                datos,
                resource.id === 'usuario' ? payloadUsuarioEmpleado : undefined,
              )
            }
            onCancel={cerrarFormulario}
          />
        </section>
      )}

      {!cargando && visibles.length === 0 && (
        <p className="status">
          {puedeGestionar
            ? 'Aún no hay registros. Crea el primero.'
            : 'Aún no hay registros en esta carta.'}
        </p>
      )}

      {resource.layout === 'cards' ? (
        <div className="product-grid">
          {visibles.map((producto) => (
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
        visibles.length > 0 && (
          <ResourceTable
            resource={resource}
            registros={visibles}
            onEditar={abrirEditar}
            onEliminar={borrar}
            puedeGestionar={puedeGestionar}
          />
        )
      )}
    </>
  )
}
