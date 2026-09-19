import { asString, type ApiRecord } from '../api/http'

interface ProductCardProps {
  producto: ApiRecord
  onEditar?: (producto: ApiRecord) => void
}

function formatearPrecio(valor: unknown) {
  const numero = Number(valor)
  if (Number.isNaN(numero)) return asString(valor)
  return `$ ${numero.toLocaleString('es-CO')}`
}

export function ProductCard({ producto, onEditar }: ProductCardProps) {
  const imagen = asString(producto.imagen)
  const nombre = asString(producto.nombre)
  const descripcion = asString(producto.descripcion)
  const categoria = asString(producto.categoria)

  return (
    <article className="product-card">
      <div className="product-media">
        {categoria && <span className="product-tag">{categoria}</span>}
        {imagen ? (
          <img src={imagen} alt={nombre} loading="lazy" />
        ) : (
          <div className="product-fallback">TG</div>
        )}
      </div>
      <div className="product-body">
        <h3>{nombre}</h3>
        <p>{descripcion}</p>
        <div className="product-meta">
          <strong>{formatearPrecio(producto.precio)}</strong>
          {onEditar && (
            <button type="button" onClick={() => onEditar(producto)}>
              Editar
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
