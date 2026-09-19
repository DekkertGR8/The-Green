import { ProductCard } from '../components/ProductCard'
import { Banner } from '../components/Banner'
import type { ApiRecord } from '../api/http'
import { esAdmin, esPersonal } from '../auth/roles'
import type { Sesion } from '../auth/sesion'
import type { ViewId } from '../config/resources'

interface HomePageProps {
  productos: ApiRecord[]
  cargando: boolean
  error: string
  onCambiarVista: (vista: ViewId) => void
  onAgregar: (producto: ApiRecord) => void
  sesion: Sesion | null
}

export function HomePage({
  productos,
  cargando,
  error,
  onCambiarVista,
  onAgregar,
  sesion,
}: HomePageProps) {
  const personal = esPersonal(sesion)
  const admin = esAdmin(sesion)

  return (
    <>
      <Banner
        eyebrow="Casa de café · barra de autor"
        title="The Green, donde la noche se sirve despacio"
        subtitle="Un café-bar de hierro, madera y latón. Carta viva desde Mock API: productos, huéspedes y el pulso de cada orden."
      />

      <section className="home-grid">
        <article className="panel">
          <p className="eyebrow">La casa</p>
          <h2>Vintage industrial, sin pose</h2>
          <p>
            The Green nace como una sala íntima de Bogotá: lámparas de taller,
            barra de acero y una carta que cruza espresso de especialidad con
            cócteles clásicos.
          </p>
        </article>
        {admin ? (
          <article className="panel">
            <p className="eyebrow">Administración</p>
            <h2>Tú creas al personal</h2>
            <p>
              Desde Usuarios das de alta empleados. Ellos gestionan clientes y
              órdenes. Categorías y estados de orden también quedan en esta
              cuenta.
            </p>
            <button type="button" onClick={() => onCambiarVista('usuario')}>
              Crear empleados
            </button>
          </article>
        ) : personal ? (
          <article className="panel">
            <p className="eyebrow">Sala y barra</p>
            <h2>Clientes y órdenes a tu cargo</h2>
            <p>
              Puedes crear, actualizar y eliminar huéspedes y pedidos. La
              administración de usuarios queda en el admin.
            </p>
            <button type="button" onClick={() => onCambiarVista('orden')}>
              Ver órdenes
            </button>
          </article>
        ) : (
          <article className="panel">
            <p className="eyebrow">Para huéspedes</p>
            <h2>Carta y pedido, sin el back office</h2>
            <p>
              Recorre la carta y arma tu orden. La operación de sala y las
              cuentas de personal no se muestran aquí.
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
