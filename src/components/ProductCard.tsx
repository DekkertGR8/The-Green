import { asMoney, asString, type ApiRecord } from '../api/http'
import imagenFallback from '../assets/hero.png'

interface ProductCardProps {
  producto: ApiRecord
  onEditar?: (producto: ApiRecord) => void
  onEliminar?: (producto: ApiRecord) => void
  onAgregar?: (producto: ApiRecord) => void
}

export function ProductCard({
  producto,
  onEditar,
  onEliminar,
  onAgregar,
}: ProductCardProps) {
  const imagen = asString(producto.imagen)
  const nombre = asString(producto.nombre)
  const descripcion = asString(producto.descripcion)
  const categoria = asString(producto.categoria)

  return (
    <article className="product-card">
      <div className="product-media">
        {categoria && <span className="product-tag">{categoria}</span>}
        {imagen ? (
          <img
            src={imagen}
            alt={nombre}
            loading="lazy"
            onError={(evento) => {
              evento.currentTarget.onerror = null
              evento.currentTarget.src = imagenFallback
            }}
          />
        ) : (
          <img src={imagenFallback} alt={nombre} loading="lazy" />
        )}
      </div>
      <div className="product-body">
        <h3>{nombre}</h3>
        <p>{descripcion}</p>
        <div className="product-meta">
          <strong>{asMoney(producto.precio)}</strong>
          <div className="product-actions">
            {onAgregar && (
              <button type="button" onClick={() => onAgregar(producto)}>
                Pedir
              </button>
            )}
            {onEditar && (
              <button type="button" className="ghost" onClick={() => onEditar(producto)}>
                Editar
              </button>
            )}
            {onEliminar && (
              <button
                type="button"
                className="danger"
                onClick={() => onEliminar(producto)}
              >
                Eliminar
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
