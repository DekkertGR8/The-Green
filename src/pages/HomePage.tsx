import { ProductCard } from '../components/ProductCard'
import { Banner } from '../components/Banner'
import type { ApiRecord } from '../api/http'
import type { ViewId } from '../config/resources'

interface HomePageProps {
  productos: ApiRecord[]
  cargando: boolean
  error: string
  onCambiarVista: (vista: ViewId) => void
  onAgregar: (producto: ApiRecord) => void
  puedeGestionar: boolean
}

export function HomePage({
  productos,
  cargando,
  error,
  onCambiarVista,
  onAgregar,
  puedeGestionar,
}: HomePageProps) {
  return (
    <>
      <Banner
        eyebrow="Casa de café · barra de autor"
        title="The Green, donde la noche se sirve despacio"
        subtitle="Un café-bar de hierro, madera y latón. Carta viva desde Mock API: productos, categorías, huéspedes, personal y el pulso de cada orden."
      />

      <section className="home-grid">
        <article className="panel">
          <p className="eyebrow">La casa</p>
          <h2>Vintage industrial, sin pose</h2>
          <p>
            The Green nace como una sala íntima de Bogotá: lámparas de taller,
            barra de acero y una carta que cruza espresso de especialidad con
            cócteles clásicos. Este sistema gestiona toda la operación del
            local.
          </p>
        </article>
        {puedeGestionar ? (
          <article className="panel">
            <p className="eyebrow">Operación</p>
            <h2>Gestión reservada al personal</h2>
            <p>
              Categorías, usuarios, clientes, órdenes y estados se consultan y
              modifican solo con una cuenta de empleado. La carta pública sigue
              visible para los huéspedes.
            </p>
            <button type="button" onClick={() => onCambiarVista('usuario')}>
              Abrir gestión
            </button>
          </article>
        ) : (
          <article className="panel">
            <p className="eyebrow">Para huéspedes</p>
            <h2>Carta y pedido, sin el back office</h2>
            <p>
              Puedes recorrer la carta y armar tu orden. La información de
              personal, clientes y operación de sala queda fuera de esta vista.
            </p>
            <button type="button" onClick={() => onCambiarVista('producto')}>
              Ver la carta
            </button>
          </article>
        )}
      </section>

      <section>
        <div className="section-head">
          <div>
            <p className="eyebrow">Selección de barra</p>
            <h2>Piezas de la carta</h2>
          </div>
          <button type="button" className="ghost" onClick={() => onCambiarVista('producto')}>
            Ver todos
          </button>
        </div>

        {cargando && <p className="status">Cargando la carta desde la API...</p>}
        {error && <p className="status is-error">{error}</p>}

        <div className="product-grid">
          {productos.slice(0, 4).map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              onAgregar={onAgregar}
            />
          ))}
        </div>
      </section>
    </>
  )
}
