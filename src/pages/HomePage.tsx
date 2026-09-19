import { ProductCard } from '../components/ProductCard'
import { Banner } from '../components/Banner'
import type { ApiRecord } from '../api/http'
import type { ViewId } from '../config/resources'

interface HomePageProps {
  productos: ApiRecord[]
  cargando: boolean
  error: string
  onCambiarVista: (vista: ViewId) => void
}

export function HomePage({
  productos,
  cargando,
  error,
  onCambiarVista,
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
        <article className="panel">
          <p className="eyebrow">Operación</p>
          <h2>Todo el Mock API en un solo menú</h2>
          <p>
            Productos, categorías, usuarios, clientes, órdenes y estados de
            orden se consultan, registran y actualizan en vivo. Cada recurso
            tiene su propio acceso desde el encabezado.
          </p>
          <button type="button" onClick={() => onCambiarVista('producto')}>
            Abrir la carta
          </button>
        </article>
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
            <ProductCard key={producto.id} producto={producto} />
          ))}
        </div>
      </section>
    </>
  )
}
